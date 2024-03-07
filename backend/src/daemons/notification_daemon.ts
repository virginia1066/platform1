import { knex, MIN_NOTIFY_WORDS_COUNT, NOTIFY_REPEAT_TIME, TG } from '../constants';
import { __, evolve, filter, gte, map, pipe, prop } from 'ramda';
import { asyncMap } from '@tsigel/async-map';
import dayjs from 'dayjs';
import { wait } from '../utils/wait';
import { warn } from '../utils/log';
import { getFixedT } from 'i18next';

export const notification_daemon = () => {
    const t = getFixedT(null, null, 'server');

    const get_time_to_next_loop = () => {
        const now = dayjs();
        const [hours, minutes] = NOTIFY_REPEAT_TIME.split(':').map(Number);
        let targetTime = dayjs()
            .set('hours', hours)
            .set('minutes', minutes)
            .set('seconds', 0)
            .set('millisecond', 0);

        if (targetTime.isBefore(now)) {
            targetTime = targetTime.add(1, 'day');
        }
        return targetTime.diff(now);
    };
    const loop = () =>
        knex('learn_cards')
            .select<Array<Item<string>>>(knex.raw('COUNT(*) as card_count, "student_id", "users"."tg_id" as tg_id'))
            .innerJoin('tg_users as users', 'users.mk_id', 'learn_cards.student_id')
            .where('due', '<=', knex.raw('CURRENT_TIMESTAMP'))
            .groupBy('student_id', 'users.tg_id')
            .then(map(evolve({
                card_count: Number
            })))
            .then(filter(pipe(prop('card_count'), gte(__, MIN_NOTIFY_WORDS_COUNT))))
            .then((list) => {
                return asyncMap(5, ({ tg_id, card_count }) => {
                    return TG.sendMessage(tg_id, t('notify_message', { count: card_count }))
                        .catch(warn);
                }, list);
            })
            .finally(() => {
                wait(get_time_to_next_loop())
                    .then(loop);
            });

    wait(get_time_to_next_loop())
        .then(loop);
};

type Item<T = number> = {
    card_count: T;
    student_id: number;
    tg_id: number
}
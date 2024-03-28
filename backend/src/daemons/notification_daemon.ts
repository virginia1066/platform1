import { knex, MIN_NOTIFY_WORDS_COUNT, MK_DATE_PATTERN, NOTIFY_REPEAT_TIME, TG, TG_MK_ADMIN_USER } from '../constants';
import { __, concat, evolve, filter, gte, indexBy, is, map, pipe, prop, uniq } from 'ramda';
import { asyncMap } from '@tsigel/async-map';
import dayjs from 'dayjs';
import { wait } from '../utils/wait';
import { error, info } from '../utils/log';
import { getFixedT } from 'i18next';
import { SubscriptionEndStatus, TgUser } from '../types/general';
import { MessageSpliter } from '../services/MessageSpliter';

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
        Promise
            .all([
                knex('learn_cards')
                    .select<Array<Item<string>>>(knex.raw('COUNT(*) as card_count, "student_id", "users"."tg_id" as tg_id'))
                    .innerJoin('tg_users as users', 'users.mk_id', 'learn_cards.student_id')
                    .where('due', '<=', knex.raw('CURRENT_TIMESTAMP'))
                    .groupBy('student_id', 'users.tg_id')
                    .then(map(evolve({
                        card_count: Number
                    })))
                    .then(filter(pipe(prop('card_count'), gte(__, MIN_NOTIFY_WORDS_COUNT)))),
                knex('subscription_notify')
                    .innerJoin<TgUser>('tg_users as users', 'users.mk_id', 'subscription_notify.student_id')
                    .where('notify_status', SubscriptionEndStatus.Pending)
            ])
            .then(([cards, notify_list]) => {
                const cards_hash = indexBy(prop('student_id'), cards);
                const subscriptions_hash = indexBy(prop('student_id'), notify_list);
                const students = uniq(concat(
                    cards.map(prop('student_id')),
                    notify_list.map(prop('student_id'))
                ));

                const get_time_diff = (date: string) =>
                    dayjs().diff(dayjs(date, MK_DATE_PATTERN), 'days');

                return asyncMap(5, (student_id) => {
                    const card = cards_hash[student_id];
                    const subscription = subscriptions_hash[student_id];
                    const tg_id = card.tg_id ?? subscription.tg_id;

                    const card_tpl = card
                        ? t('notify_cards', { count: card.card_count })
                        : null;
                    const subscription_tpl = subscription
                        ? t('notify_subscriptions', {
                            count: get_time_diff(subscription.end_date),
                            admin: TG_MK_ADMIN_USER
                        })
                        : null;

                    if (subscription) {
                        knex('subscription_notify')
                            .update('notify_status', SubscriptionEndStatus.Done)
                            .where(subscription);
                    }

                    const messages = new MessageSpliter([
                        card_tpl,
                        subscription_tpl
                    ].filter(is(String)), '\n\n').get_messages();

                    const send = (id: number, message: string): Promise<unknown> =>
                        TG.sendMessage(id, message)
                            .catch((e: any) => {
                                if (e.response.statusCode === 429) {
                                    info(`Too many requests to telegram!`);
                                    return wait(5_000)
                                        .then(() => send(id, message));
                                }
                                error(e);
                            });

                    return asyncMap(1, (message) => send(tg_id, message), messages);
                }, students);
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
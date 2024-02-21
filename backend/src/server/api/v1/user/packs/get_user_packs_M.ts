import { Middleware } from 'koa';
import { knex, SYSTEM_PACK_ID } from '../../../../../constants';
import { number, object } from 'yup';
import { yup_validate } from '../../../../../utils/yup_validate';
import { get_student_by_tg } from '../../../../../utils/get_student_by_tg';
import { PackStatus } from '../../../../../types/Wokobular';
import { head, map, omit } from 'ramda';
import { set_body } from '../../../../utils/set_body';
import { State } from 'fsrs.js';

const schema = object().shape({
    tg_id: number().required().integer()
});

export const get_user_packs_M: Middleware = (ctx, next) =>
    yup_validate(schema, ctx.request.body)
        .then(({ tg_id }) => get_student_by_tg(tg_id, true))
        .then((student_id: number) => Promise
            .all([
                knex('packs')
                    .where('status', PackStatus.Active)
                    .where('parent_user_id', 'in', [SYSTEM_PACK_ID, student_id])
                    .then(map(omit(['parent_user_id', 'status']))),
                knex('packs as p')
                    .join('pack_links as pl', 'p.id', '=', 'pl.pack_id')
                    .join('words as w', 'pl.word_id', '=', 'w.id')
                    .join('learn_cards as lc', 'w.id', '=', 'lc.word_id')
                    .where('p.parent_user_id', student_id)
                    .groupBy('p.id')
                    .select(
                        'p.id as pack_id',
                        knex.raw('SUM(CASE WHEN lc.state = 0 THEN 1 ELSE 0 END) AS count_new'),
                        knex.raw('SUM(CASE WHEN lc.state = 1 THEN 1 ELSE 0 END) AS count_learning'),
                        knex.raw('SUM(CASE WHEN lc.state = 2 THEN 1 ELSE 0 END) AS count_review'),
                        knex.raw('SUM(CASE WHEN lc.state = 3 THEN 1 ELSE 0 END) AS count_relearning')
                    )
            ]))
        .then(set_body(ctx))
        .then(next);

type UserStateCount = { count: number; state: State };

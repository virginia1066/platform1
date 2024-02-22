import { Middleware } from 'koa';
import { knex, SYSTEM_PACK_ID } from '../../../../../constants';
import { number, object } from 'yup';
import { yup_validate } from '../../../../../utils/yup_validate';
import { get_student_by_tg } from '../../../../../utils/get_student_by_tg';
import { PackStatus } from '../../../../../types/Wokobular';
import { __, converge, identity, indexBy, map, mergeLeft, omit, pipe, prop } from 'ramda';
import { set_body } from '../../../../utils/set_body';
import { NotFound } from '../../../../middlewares/errors';

const schema = object().shape({
    tg_id: number().required().integer()
});

/**
 * @swagger
 * /api/v1/user/packs:
 *   get:
 *     summary: Получить статистику колод пользователя
 *     description: Возвращает статистику по колодам пользователя по его идентификатору.
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает массив статистики колод пользователя.
 *         schema:
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *                 description: Идентификатор колоды.
 *               name:
 *                 type: string
 *                 description: Название колоды.
 *               count_new:
 *                 type: number
 *                 description: Количество слов в колоде со статусом "new".
 *               count_learning:
 *                 type: number
 *                 description: Количество слов в колоде со статусом "learning".
 *               count_review:
 *                 type: number
 *                 description: Количество слов в колоде со статусом "review".
 *               count_relearning:
 *                 type: number
 *                 description: Количество слов в колоде со статусом "relearning".
 */
export const get_user_packs_M: Middleware = (ctx, next) =>
    yup_validate(schema, ctx.request.body)
        .then(({ tg_id }) => get_student_by_tg(tg_id, true, NotFound))
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
                    .select<PackStat[]>(
                        'p.id as pack_id',
                        knex.raw('SUM(CASE WHEN lc.state = 0 THEN 1 ELSE 0 END) AS count_new'),
                        knex.raw('SUM(CASE WHEN lc.state = 1 THEN 1 ELSE 0 END) AS count_learning'),
                        knex.raw('SUM(CASE WHEN lc.state = 2 THEN 1 ELSE 0 END) AS count_review'),
                        knex.raw('SUM(CASE WHEN lc.state = 3 THEN 1 ELSE 0 END) AS count_relearning')
                    )
                    .then(indexBy(prop('pack_id')))
            ]))
        .then(([pack_list, stats_hash]) =>
            pack_list
                .map(
                    converge(
                        mergeLeft, [
                            identity,
                            pipe(prop('id'), prop(__, stats_hash))
                        ]
                    )
                )
                .map(omit(['pack_id'])))
        .then(set_body(ctx))
        .then(next);

type PackStat = {
    pack_id: number;
    count_new: number;
    count_learning: number;
    count_review: number;
    count_relearning: number;
};

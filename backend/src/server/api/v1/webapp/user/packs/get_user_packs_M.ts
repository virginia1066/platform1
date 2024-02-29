import { knex } from '../../../../../../constants';
import { set_body } from '../../../../../utils/set_body';
import { MiddlewareWithToken } from '../../../../../middlewares/check_token_M';
import { applySpec, map, pipe, prop } from 'ramda';
import { WordStatus } from '../../../../../../types/Wokobular';

/**
 * @swagger
 * /api/v1/web-app/user/packs:
 *   get:
 *     summary: Получить статистику колод пользователя
 *     description: >
 *       Возвращает статистику по колодам пользователя по его идентификатору.
 *       Требуется наличие httpOnly cookie SESSION. Для  получения сессии смотри
 *       /api/v1/web-app/user/auth.
 *     tags: [User Private API]
 *     security:
 *       - httpOnlyCookieAuth: []
 *     responses:
 *       '200':
 *         description: >
 *           Успешный запрос. Возвращает массив статистики колод пользователя.
 *         schema:
 *           type: array
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
 *     securitySchemes:
 *       httpOnlyCookieAuth:
 *         type: apiKey
 *         in: cookie
 *         name: SESSION
 */
export const get_user_packs_M: MiddlewareWithToken = (ctx, next) =>
    knex('packs as p')
        .leftJoin('pack_links as pl', 'p.id', 'pl.pack_id')
        .leftJoin('words as w', function () {
            this.on('pl.word_id', 'w.id')
                .andOn('w.status', knex.raw('?', [WordStatus.Active]));
        })
        .leftJoin('learn_cards as lc', function () {
            this.on('w.id', 'lc.word_id')
                .andOn('lc.student_id', knex.raw('?', [ctx.state.token.user_id]));
        })
        .whereIn('p.parent_user_id', [ctx.state.token.user_id, '0'])
        .groupBy('p.id')
        .select<PackStat<string>[]>(
            'p.id AS id',
            'p.name AS name',
            'p.user_can_edit as user_can_edit',
            knex.raw('COUNT(w.id) as words_count'),
            knex.raw('SUM(CASE WHEN CAST(lc.state AS INTEGER) = 0 THEN 1 ELSE 0 END) + COUNT(CASE WHEN lc IS NULL THEN 1 END) AS count_new'),
            knex.raw('SUM(CASE WHEN CAST(lc.state AS INTEGER) = 1 THEN 1 ELSE 0 END) AS count_learning'),
            knex.raw('SUM(CASE WHEN CAST(lc.state AS INTEGER) = 2 THEN 1 ELSE 0 END) AS count_review'),
            knex.raw('SUM(CASE WHEN CAST(lc.state AS INTEGER) = 3 THEN 1 ELSE 0 END) AS count_relearning'),
            knex.raw('SUM(CASE WHEN lc.due < CURRENT_TIMESTAMP THEN 1 ELSE 0 END) + COUNT(CASE WHEN lc IS NULL THEN 1 END) as count_can_be_shown')
        )
        .then(map(
            applySpec<any>({
                name: prop('name'),
                id: prop('id'),
                user_can_edit: prop('user_can_edit'),
                stats: applySpec({
                    count_new: pipe(prop('count_new'), Number),
                    count_learning: pipe(prop('count_learning'), Number),
                    count_review: pipe(prop('count_review'), Number),
                    count_relearning: pipe(prop('count_relearning'), Number),
                    words_count: pipe(prop('words_count'), Number),
                    count_can_be_shown: pipe(prop('count_can_be_shown'), Number)
                })
            }))
        )
        .then(set_body(ctx))
        .then(next);

type PackStat<Int = number> = {
    id: number;
    name: string;
    count_new: Int;
    count_learning: Int;
    count_review: Int;
    count_relearning: Int;
    words_count: Int;
    count_can_be_shown: Int;
};

import { knex } from '../../../../../../constants';
import { set_body } from '../../../../../utils/set_body';
import { MiddlewareWithToken } from '../../../../../middlewares/check_token_M';
import { evolve, map, pipe } from 'ramda';
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

const update_pack = ({
                         words_count,
                         count_new,
                         count_relearning,
                         count_learning,
                         count_review,
                         ...props
                     }: PackStat): PackStat => ({
    ...props,
    count_review,
    words_count,
    count_learning,
    count_relearning,
    count_new: words_count - count_review - count_relearning - count_learning
});

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
            knex.raw('COUNT(w.id) as words_count'),
            knex.raw('SUM(CASE WHEN CAST(lc.state AS INTEGER) = 0 THEN 1 ELSE 0 END) AS count_new'),
            knex.raw('SUM(CASE WHEN CAST(lc.state AS INTEGER) = 1 THEN 1 ELSE 0 END) AS count_learning'),
            knex.raw('SUM(CASE WHEN CAST(lc.state AS INTEGER) = 2 THEN 1 ELSE 0 END) AS count_review'),
            knex.raw('SUM(CASE WHEN CAST(lc.state AS INTEGER) = 3 THEN 1 ELSE 0 END) AS count_relearning')
        )
        .then(map(pipe(
            evolve({
                count_new: Number,
                count_learning: Number,
                count_review: Number,
                count_relearning: Number,
                words_count: Number
            }),
            update_pack
        )))
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
};

import { set_body } from '../../../../../utils/set_body';
import { MiddlewareWithToken } from '../../../../../middlewares/check_token_M';
import { get_user_packs } from '../../../../../utils/get_user_packs';

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
    get_user_packs({ student_id: ctx.state.student_id })
        .then(set_body(ctx))
        .then(next);


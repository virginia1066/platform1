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
 *     tags:
 *       - User Private API
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: X-Session-Token
 *         in: header
 *         description: >
 *           Токен авторизации полученный в запросе /api/v1/webhooks/user-create
 *     responses:
 *       '200':
 *         description: >
 *           Успешный запрос. Возвращает массив статистики колод пользователя.
 *         schema:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                id:
 *                  type: integer
 *                user_can_edit:
 *                  type: boolean
 *                stats:
 *                  type: object
 *                  properties:
 *                    count_new:
 *                      type: number
 *                    words_count:
 *                      type: number
 *                    count_learning:
 *                      type: number
 *                    count_review:
 *                      type: number
 *                    count_relearning:
 *                      type: number
 *                    count_can_be_shown:
 *                      type: number
 */
export const get_user_packs_M: MiddlewareWithToken = (ctx, next) =>
    get_user_packs({ student_id: ctx.state.student_id })
        .then(set_body(ctx))
        .then(next);


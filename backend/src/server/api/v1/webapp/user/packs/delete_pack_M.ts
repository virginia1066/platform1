import { MiddlewareWithToken } from '../../../../../middlewares/check_token_M';
import { object } from 'yup';
import { yup_validate } from '../../../../../../utils/yup_validate';
import { knex } from '../../../../../../constants';
import { PackStatus } from '../../../../../../types/Wokobular';
import { get_user_packs } from '../../../../../utils/get_user_packs';
import { set_body } from '../../../../../utils/set_body';
import { delete_pack_id } from '../../../../../utils/schemas';

const schema = object().shape({
    pack_id: delete_pack_id
});
/**
 * @swagger
 * /api/v1/web-app/user/packs/{pack_id}:
 *   delete:
 *     summary: Удаление колоды со всеми словами
 *     description: >
 *       Удаление колоды со всеми словами. Помечает колоду удалённой, слова не удаляет,
 *       так как они могут использоваться в других колодах.
 *     tags:
 *       - User Private API
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: X-Session-Token
 *         in: header
 *         required: true
 *         description: >
 *           Токен авторизации полученный в запросе /api/v1/webhooks/user-create
 *         type: string
 *       - name: pack_id
 *         required: true
 *         in: path
 *         description: id колоды для удаления
 *         type: integer
 *     responses:
 *       '200':
 *         description: >
 *           Колода успешно удалена,
 *           возвращает список актуальных колод для пользователя
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               id:
 *                 type: integer
 *               user_can_edit:
 *                 type: boolean
 *               stats:
 *                 type: object
 *                 properties:
 *                   count_new:
 *                     type: number
 *                   words_count:
 *                     type: number
 *                   count_learning:
 *                     type: number
 *                   count_review:
 *                     type: number
 *                   count_relearning:
 *                     type: number
 *                   count_can_be_shown:
 *                     type: number
 */
export const delete_pack_M: MiddlewareWithToken = (ctx, next) =>
    yup_validate(schema, ctx.params, ctx.state)
        .then(({ pack_id }) =>
            Promise.all([
                knex('packs')
                    .update('status', PackStatus.Deleted)
                    .where('id', pack_id),
                knex('pack_links')
                    .del()
                    .where('pack_id', pack_id)
            ])
        )
        .then(() => get_user_packs({ student_id: ctx.state.student_id }))
        .then(set_body(ctx))
        .then(next);

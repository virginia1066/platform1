import { MiddlewareWithToken } from '../../../../../middlewares/check_token_M';
import { number, object } from 'yup';
import { yup_validate } from '../../../../../../utils/yup_validate';
import { knex, SYSTEM_PACK_ID } from '../../../../../../constants';
import { Pack, WordStatus } from '../../../../../../types/Wokobular';
import { head, omit } from 'ramda';
import { NotFound, PermissionDenied } from '../../../../../middlewares/errors';
import { set_body } from '../../../../../utils/set_body';
import { get_stats_by_pack } from '../../../../../../utils/get_stats_by_pack';
import { log_query } from '../../../../../../utils/log_query';


const schema = object().shape({
    pack_id: number().required().integer()
});
/**
 * @swagger
 * /api/v1/web-app/user/packs/{pack_id}:
 *   get:
 *     summary: Получение данных колоды
 *     description: Получение данных колоды (слова + статистика)
 *     tags:
 *       - User Private API
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: X-Session-Token
 *         in: header
 *         description: >
 *           Токен авторизации полученный в запросе /api/v1/webhooks/user-create
 *         type: string
 *         required: true
 *       - name: pack_id
 *         required: true
 *         in: path
 *         description: id колоды
 *         type: integer
 *     responses:
 *       '200':
 *         description: Данные колоды
 *         schema:
 *           type: object
 *           properties:
 *             words:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   ru:
 *                     type: string
 *                   en:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [ACTIVE, DELETED]
 *             stats:
 *               type: object
 *               properties:
 *                 count_new:
 *                   type: number
 *                 words_count:
 *                   type: number
 *                 count_learning:
 *                   type: number
 *                 count_review:
 *                   type: number
 *                 count_relearning:
 *                   type: number
 *                 count_can_be_shown:
 *                   type: number
 */
export const get_pack_words_M: MiddlewareWithToken = (ctx, next) =>
    yup_validate(schema, ctx.params)
        .then(({ pack_id }) =>
            knex('packs')
                .select('*')
                .where('id', pack_id)
                .then<Pack | undefined>(head)
                .then((pack) => {
                    if (!pack) {
                        throw new NotFound();
                    }
                    if (![SYSTEM_PACK_ID, Number(ctx.state.token.user_id)].includes(pack.parent_user_id)) {
                        throw new PermissionDenied();
                    }

                    const student_id = ctx.state.token.user_id;

                    return Promise
                        .all([
                            log_query(knex('pack_links')
                                .select(
                                    'pack_links.word_id as id',
                                    'ru',
                                    'en',
                                    'status',
                                    'learn_cards.due as due',
                                )
                                .innerJoin('words', 'words.id', 'pack_links.word_id')
                                .leftJoin('learn_cards', function () {
                                    this.on('words.id', 'learn_cards.word_id')
                                        .andOn(knex.raw(`"learn_cards"."student_id" = ${student_id}`));
                                })
                                .where('words.status', WordStatus.Active)
                                .where('pack_id', pack_id)),
                            get_stats_by_pack({
                                pack_id: pack_id,
                                student_id: Number(ctx.state.token.user_id)
                            })
                        ])
                        .then(([words, stats]) => Object.assign(
                            Object.create(null),
                            {
                                ...omit(['parent_user_id', 'status', 'insert_id'], pack),
                                words,
                                stats
                            })
                        );
                })
        )
        .then(set_body(ctx))
        .then(next);
import { Middleware } from 'koa';
import { number, object } from 'yup';
import { yup_validate } from '../../../../../utils/yup_validate';
import { knex, MESSAGE_BUS } from '../../../../../constants';
import { HomeTaskWebhook, WebhookHomeTaskStatus } from '../../../../../types/general';
import { head } from 'ramda';
import { set_body } from '../../../../utils/set_body';
import { info } from '../../../../../utils/log';

const schema = object().shape({
    object: object().required().shape({
        lessonId: number().required().integer()
    })
});
/**
 * @swagger
 * /api/v1/webhooks/on-home-task-update:
 *   post:
 *     description: Вебхук который должен вызываться при редактировании слов в домашнем задании
 *     tags: [My Class Webhook]
 *   consumes:
 *       - application/json
 *   parameters:
 *     - name: event
 *       in: body
 *       type: string
 *       enum: [user_new]
 *     - name: object
 *       in: body
 *       type: object
 *       schema:
 *         type: object
 *         required:
 *           - userId
 *           - createdAt
 *           - name
 *         properties:
 *           userId:
 *             type: integer
 *           createdAt:
 *             type: string
 *           name:
 *             type: string
 *   responses:
 *     200:
 *       description: login
 *       schema:
 *         type: object
 */
export const on_home_task_update_M: Middleware = (ctx, next) =>
    yup_validate(schema, ctx.request.body)
        .then(({ object: { lessonId } }) => {
            info(`Home task update!`, lessonId);
            return knex('home_task_webhook')
                .insert({
                    lesson_id: lessonId,
                    status: WebhookHomeTaskStatus.Pending
                })
                .onConflict('lesson_id')
                .merge()
                .returning('*')
                .then<HomeTaskWebhook>(head)
                .then((task) => {
                    MESSAGE_BUS.trigger('home_task_update', task);
                    return { ok: true };
                })
                .then(set_body(ctx))
                .then(next);
        });
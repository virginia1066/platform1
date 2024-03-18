import { Middleware } from 'koa';
import { number, object, string } from 'yup';
import { yup_validate } from '../../../../../utils/yup_validate';
import { knex } from '../../../../../constants';
import { SubscriptionEndStatus, TgUser } from '../../../../../types/general';
import { set_body } from '../../../../utils/set_body';
import { always, head } from 'ramda';
import dayjs from 'dayjs';

const schema = object()
    .shape({
        event: string().required().oneOf(['sub_end']),
        object: object().shape({
            userSubscriptionId: number().required().integer(),
            userId: number().required().integer(),
            endDate: string().required()
        })
    });
/**
 * @swagger
 * /api/v1/webhooks/subscription-expiry:
 *   post:
 *     description: Вебхук который должен вызываться за X дней до конуа абонемента
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
export const subscription_expiry_M: Middleware = (ctx, next) =>
    yup_validate(schema, ctx.request.body)
        .then(({ object: { userSubscriptionId, userId, endDate } }) =>
            knex('tg_users')
                .where('mk_id', userId)
                .then<TgUser | undefined>(head)
                .then((user) =>
                    knex('subscription_notify')
                        .insert({
                            notify_status: user
                                ? SubscriptionEndStatus.Pending
                                : SubscriptionEndStatus.NoTelegram,
                            subscription_id: userSubscriptionId,
                            student_id: userId,
                            end_date: endDate,
                            created_at: dayjs().toISOString()
                        })
                        .onConflict('subscription_id')
                        .ignore()
                        .returning('*')
                        .then(always({ ok: true }))
                        .then(set_body(ctx))
                        .then(next)
                )

        );
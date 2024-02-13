import { Middleware } from 'koa';
import { yup_validate_sync } from '../../../../../utils/yup_validate';
import { number, object, string } from 'yup';
import { knex, MESSAGE_BUS } from '../../../../../constants';
import { WebhookUserStatus } from '../../../../../types/general';
import { make_id } from '../../../../../utils/make_id';
import { randomUUID } from 'crypto';
import { info } from '../../../../../utils/log';

const body_schema = object().shape({
    event: string().required().oneOf(['user_new']),
    object: object().required().shape({
        userId: number().required().integer()
    })
});

/**
 * @swagger
 * /api/v1/webhooks/user-create:
 *   post:
 *     description: Url for webhook after user creation
 *     tags: [User Create Webhook]
 *     produces:
 *       - application/json
 *     parameters:
 *       - event
 *       - object
 *          - userId
 *     responses:
 *       200:
 *         description: login
 *         schema:
 *           type: object
 */
const middleware: Middleware = (ctx, next) => {
    const { object: { userId } } = yup_validate_sync(body_schema, ctx.request.body);
    info(`Get user create event from my class! ${userId}`, ctx.request.body);

    return knex('users_from_webhook')
        .insert([{
            class_id: userId,
            attribute_status: WebhookUserStatus.Pending,
            link_param: make_id(`link-${userId}-${randomUUID()}`)
        }])
        .returning('*')
        .then(([user]) => {
            MESSAGE_BUS.trigger('user_create', user);
            ctx.body = { ok: true };
        })
        .then(next);
};

export default middleware;
import { Middleware } from 'koa';
import { yup_validate_sync } from '../../../../../utils/yup_validate';
import { number, object, string } from 'yup';
import { MESSAGE_BUS } from '../../../../../constants';
import { info } from '../../../../../utils/log';
import { make_link_params } from '../../../../../utils/make_link_params';

const body_schema = object().shape({
    event: string().required().oneOf(['user_new']),
    object: object().required().shape({
        userId: number().required().integer(),
        createdAt: string().required(),
        name: string().required()
    })
});

/**
 * @swagger
 * /api/v1/webhooks/user-create:
 *   post:
 *     description: Url for webhook after user creation
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
const middleware: Middleware = (ctx, next) => {
    const { object: { userId, createdAt } } = yup_validate_sync(body_schema, ctx.request.body);
    info(`Get user create event from my class! ${userId}`, ctx.request.body);

    return make_link_params([{ class_id: userId, user_created_at: createdAt }])
        .then(([user]) => {
            MESSAGE_BUS.trigger('user_create', user);
            ctx.body = { ok: true };
        })
        .then(next);
};

export default middleware;
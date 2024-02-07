import { Middleware } from 'koa';
import { yup_validate_sync } from '../../../../../utils/yup_validate';
import { number, object, string } from 'yup';
import { knex, MESSAGE_BUS } from '../../../../../constants';
import { WebhookUserStatus } from '../../../../../types/general';
import { make_id } from '../../../../../utils/make_id';

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
 *     responses:
 *       200:
 *         description: login
 *         schema:
 *           type: object
 */
const middleware: Middleware = (ctx, next) => {
    const { object: { userId } } = yup_validate_sync(body_schema, ctx.request.body);

    return knex('users_from_webhook')
        .insert([{
            class_id: userId,
            attribute_status: WebhookUserStatus.Pending,
            link_param: make_id(`link-${userId}-${crypto.randomUUID()}`)
        }])
        .returning('*')
        .then(([user]) => {
            MESSAGE_BUS.trigger('user_create', user);

            ctx.body = { ok: true };
        })
        .then(next);
};

export default middleware;

type WebhookBody = {
    companyId: number;
    event: 'user_new';
    init: {
        time: number;
        from: string;
        managerId: number;
    };
    object: {
        userId: number;
        filials: Array<number>;
        attributes: Array<Attribute>;
        name: string;
        balans: number;
        email: string | null;
        createdAt: string;
        statusId: number;
        advSourceId: number | null;
        responsibleId: number | null;
        statusReasonId: number | null;
        createSourceId: number;
        prevStatusId: number | null;
        prevStatusReasonId: number | null;
        phone: string;
        remind: string | number | null;
    },
    changedFields: Array<any>;
};

type Attribute = {
    attributeId: number;
    attributeAlias: string;
    attributeName: string;
    attributeType: string;
    value: string;
}
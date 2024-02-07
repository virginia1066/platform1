import { Middleware } from 'koa';

/**
 * @swagger
 * /api/v1/webhooks/user-create:
 *   post:
 *     description: Url for webhook after user creation
 *     tags: [User Create Webhook]
 *     produces:
 *       - application/json
 *     parameters:
 *     responses:
 *       200:
 *         description: login
 *         schema:
 *           type: object
 */
const middleware: Middleware = (ctx, next) => {
    const headers = JSON.stringify(ctx.headers, null, 4);
    const body = ctx.request.body
        ? JSON.stringify(ctx.request.body, null, 4)
        : `Has no body in request!`;
    console.info([
        'Request to create user webhook',
        `Headers: `,
        headers,
        body
    ].join('\n'));

    ctx.body = { ok: true };
    return next();
};

export default middleware;
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
    const from_ip = ctx.request.ip;
    console.info([
        'Request to create user webhook',
        `Headers: `,
        headers,
        from_ip
    ].join('\n'));

    ctx.body = { ok: true };
    return next();
};

export default middleware;
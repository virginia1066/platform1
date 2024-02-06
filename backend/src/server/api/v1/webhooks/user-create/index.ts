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

};

export default middleware;
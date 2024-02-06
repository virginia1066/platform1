import Koa from 'koa';
import koaBody from 'koa-body';
import { applyErrorM } from './middlewares/errors';
import { log_M } from './middlewares/log_M';
import { SERVER_PORT } from '../constants';
import Router from 'koa-router';
import mount from 'koa-mount';
import user_create_webhook_M from './api/v1/webhooks/user-create';

export const create_server = () => {
    const app = new Koa();
    const router_v1 = new Router();

    router_v1
        .post('/webhooks/user-create', user_create_webhook_M)

    const api_v1 = new Koa();

    api_v1
        .use(router_v1.routes())
        .use(router_v1.allowedMethods());

    app
        .use(applyErrorM)
        .use(log_M)
        .use(koaBody())
        .use(mount('/api/v1', api_v1))
        .listen(SERVER_PORT);

    console.info(`Launch server on port ${SERVER_PORT}`);
};
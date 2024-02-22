import Koa from 'koa';
import koaBody from 'koa-body';
import { applyErrorM } from './middlewares/errors';
import { log_M } from './middlewares/log_M';
import { SERVER_PORT } from '../constants';
import Router from 'koa-router';
import mount from 'koa-mount';
import user_create_webhook_M from './api/v1/webhooks/user-create';
import { info } from '../utils/log';
import { replace_mk_id_M } from './api/v1/debug/tg/replace_mk_id_M';
import { get_user_packs_M } from './api/v1/web-app/user/packs/get_user_packs_M';
import { set_headers_M } from './middlewares/headers';
import { auth_M } from './api/v1/web-app/user/auth';
import { check_token_M } from './middlewares/check_token_M';

export const create_server = () => {
    const app = new Koa();
    const public_router = new Router();
    const private_user_router = new Router();

    public_router
        .use(set_headers_M({
            'Content-Type': 'application/json'
        }))
        .post('/webhooks/user-create', user_create_webhook_M)
        .post('/debug/tg/replace-mk-id', replace_mk_id_M)
        .post('/web-app/user/auth', auth_M);

    private_user_router
        .use(check_token_M)
        .get('/web-app/user/packs', get_user_packs_M);

    const api_v1 = new Koa();

    api_v1
        .use(public_router.routes())
        .use(private_user_router.routes())
        .use(public_router.allowedMethods())
        .use(private_user_router.allowedMethods());

    app
        .use(applyErrorM)
        .use(log_M)
        .use(koaBody())
        .use(mount('/api/v1', api_v1))
        .listen(SERVER_PORT);

    info(`Launch server on port ${SERVER_PORT}`);
};
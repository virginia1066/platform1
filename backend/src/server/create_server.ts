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
import { get_user_packs_M } from './api/v1/webapp/user/packs/get_user_packs_M';
import { set_headers_M } from './middlewares/headers';
import { auth_M } from './api/v1/webapp/user/auth';
import { check_token_M } from './middlewares/check_token_M';
import { get_pack_words_M } from './api/v1/webapp/user/packs/get_pack_words_M';
import { word_update_M } from './api/v1/webapp/user/word-update/word_update_M';
import { on_home_task_update_M } from './api/v1/webhooks/home-task-update';
import { create_pack_M } from './api/v1/webapp/user/packs/create_pack_M';
import { delete_pack_M } from './api/v1/webapp/user/packs/delete_pack_M';
import { update_pack_M } from './api/v1/webapp/user/packs/update_pack_M';
import { event_log_M } from './api/v1/event_log_M';
import { subscription_expiry_M } from './api/v1/webhooks/subscription-expiry';

export const create_server = () => {
    const app = new Koa();
    const public_router = new Router();
    const private_user_router = new Router();

    public_router
        .use(set_headers_M({
            'Content-Type': 'application/json'
        }))
        .post('/webhooks/user-create', user_create_webhook_M)
        .post('/webhooks/on-home-task-update', on_home_task_update_M)
        .post('/webhooks/subscription-expiry', subscription_expiry_M)
        .post('/debug/tg/replace-mk-id', replace_mk_id_M)
        .post('/web-app/user/auth', auth_M)
        .post('/event/log', event_log_M);

    private_user_router
        .use(check_token_M)
        .get('/web-app/user/packs', get_user_packs_M)
        .get('/web-app/user/packs/:pack_id', get_pack_words_M)
        .patch('/web-app/user/packs/:pack_id', update_pack_M)
        .delete('/web-app/user/packs/:pack_id', delete_pack_M)
        .put('/web-app/user/packs/new', create_pack_M)
        .patch('/web-app/user/word-update', word_update_M);

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
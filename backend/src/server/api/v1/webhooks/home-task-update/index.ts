import { Middleware } from 'koa';
import { info } from '../../../../../utils/log';

export const on_home_task_update_M: Middleware = (ctx, next) => {
    info(`On home task update!`, ctx.request.body);
    ctx.body = { ok: true };
    return next();
}
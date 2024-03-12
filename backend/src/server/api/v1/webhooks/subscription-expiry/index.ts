import { Middleware } from 'koa';
import { info } from '../../../../../utils/log';

export const subscription_expiry_M: Middleware = (ctx, next) => {
    info(`Subscription-expiry:`, ctx.request.body);
    ctx.body = { ok: true };
    return next();
}
import { Middleware } from 'koa';
import { info } from '../../utils/log';

export const log_M: Middleware = (ctx, next) => {
    const now = Date.now();
    const method = ctx.request.method;
    const url = ctx.request.url;

    info(`Start request: ${method} - ${url}`);
    return next()
        .then(() => {
            info(`End request: status: ${ctx.status} time: ${Date.now() - now}ms ${method} - ${url}`);
        })
        .catch(e => {
            info(`End request: status: ${ctx.status} time: ${Date.now() - now}ms ${method} - ${url}`);
            return Promise.reject(e);
        });
};

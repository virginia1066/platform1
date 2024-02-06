import { Middleware } from 'koa';

export const log_M: Middleware = (ctx, next) => {
    const now = Date.now();
    console.info(`Start request: ${ctx.request.method} - ${ctx.request.url}`);
    return next()
        .then(() => {
            console.info(`End request: status: ${ctx.status} time: ${Date.now() - now}ms ${ctx.request.method} - ${ctx.request.url}`);
        })
        .catch(e => {
            console.info(`End request: status: ${ctx.status} time: ${Date.now() - now}ms ${ctx.request.method} - ${ctx.request.url}`);
            return Promise.reject(e);
        });
}
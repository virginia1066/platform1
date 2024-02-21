import { ParameterizedContext } from 'koa';

export const set_body = (ctx: ParameterizedContext<any, any, any>) => (data: any) => {
    ctx.body = data;
};
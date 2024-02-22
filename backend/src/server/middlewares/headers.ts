import { DefaultContext, DefaultState, Middleware } from 'koa';

export const set_headers_M: (headers: Record<string, string>) => Middleware =
    (headers: Record<string, string>) =>
        (ctx, next) => {
            Object.entries(headers).forEach(([name, value]) => ctx.set(name, value));
            return next();
        };

export type HeadersState<T extends string> = {
    s_headers: {
        [Key in T]: string
    }
} & DefaultState;

export const get_headers_M = <T extends string>(names: Array<string>): Middleware<HeadersState<T>, DefaultContext> =>
    (ctx, next) => {
        ctx.state.s_headers =
            names
                .reduce((acc, name: string) => Object.assign(acc, { [name]: ctx.get(name) }), Object.create(null));
        return next();
    };

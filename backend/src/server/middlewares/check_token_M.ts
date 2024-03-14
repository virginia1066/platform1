import { Middleware } from 'koa';
import { AUTH_HEADER_NAME } from '../../constants';
import { AuthError } from './errors';
import { parse } from '../utils/token';
import { Token } from '../../../compiled-proto/token';

export const check_token_M: MiddlewareWithToken = (ctx, next) => {
    const token_str = ctx.headers[AUTH_HEADER_NAME.toLowerCase()];

    if (!token_str || typeof token_str !== 'string') {
        throw new AuthError('Has no token!');
    }

    return parse(token_str)
        .then((token) => {
            ctx.state.token = token;
            ctx.state.student_id = Number(token.user_id);
        })
        .then(next)
}

export type AuthState = { token: Token; student_id: number };
export type MiddlewareWithToken = Middleware<AuthState>;


import { BigNumber } from '@waves/bignumber';
import { base64Decode, base64Encode, publicKey, signBytes, stringToBytes, verifySignature } from '@waves/ts-lib-crypto';
import dayjs from 'dayjs';
import Long from 'long';
import { Token } from '../../../compiled-proto/token';
import { info } from '../../utils/log';
import { AuthError } from '../middlewares/errors';
import { SESSION_SECRET } from '../../constants';

const get_token_bytes = (expireAt: number, scope: string, user_id: number | string) => {
    const expire_bytes = new BigNumber(expireAt).toBytes({ isSigned: false, isLong: true });
    const user_id_bytes = stringToBytes(String(user_id));
    const scope_bytes = stringToBytes(scope, 'utf8');

    return Uint8Array.from([
        ...Array.from(expire_bytes),
        ...Array.from(user_id_bytes),
        ...Array.from(scope_bytes),
    ]);
};

export const parse = (token_base64: string) => {
    try {
        const token = Token.decode(base64Decode(token_base64));
        const bytes = get_token_bytes(Number(token.expired_at.toString()), token.scope, token.user_id);
        const is_expired = Date.now() > Number(token.expired_at.toString());

        if (is_expired) {
            info('Parse token. Token expired!');
            return Promise.reject(new AuthError('Token expired!'));
        }

        const isValidSignature = verifySignature(publicKey(SESSION_SECRET), bytes, token.signature);

        if (!isValidSignature) {
            info('Parse token. Invalid token signature!');
            return Promise.reject(new AuthError('Invalid token signature!'));
        }

        return Promise.resolve(token);
    } catch (e) {
        info('Parse token. Invalid token.');
        return Promise.reject(new AuthError('Invalid token!'));
    }
};

export const create = ({ user_id, scope, token_live }: TokenOptions): Token => {
    const expired_at = dayjs().add(token_live, 'ms')
        .valueOf();

    const bytes = get_token_bytes(expired_at, scope, user_id);
    const signature = signBytes(SESSION_SECRET, bytes);
    return new Token({
        expired_at: Long.fromNumber(expired_at, false),
        scope,
        signature,
        user_id: String(user_id),
    });
};

export const to_base64 = (token: Token) =>
    base64Encode(Token.encode(token).finish());

type TokenOptions = {
    user_id: number;
    token_live: number;
    scope: string;
}

import { base58Encode, blake2b } from '@waves/ts-lib-crypto';
import { stringToBytes } from '@waves/ts-lib-crypto';
import { pipe } from 'ramda';

export const make_id = pipe<[string], Uint8Array, Uint8Array, string>(
    stringToBytes,
    blake2b,
    base58Encode
);
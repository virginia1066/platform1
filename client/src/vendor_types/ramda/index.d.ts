import { Func } from '../../types/utils';

export module 'ramda' {
    export function nthArg<T extends Array<any>, Index extends number>(
        index: Index
    ): (...args: T) => T[Index];

    export function prop<K extends string, T>(k: K): Func<[T], K extends keyof T ? T[K] : undefined>;
}
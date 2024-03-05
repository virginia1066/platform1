export module 'ramda' {
    export function nthArg<T extends Array<any>, Index extends number>(
        index: Index
    ): (...args: T) => T[Index];
}
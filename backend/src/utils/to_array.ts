export const to_array = <T>(item: Array<T> | T): Array<T> =>
    Array.isArray(item) ? item : [item];
import { ArrayEntry } from '../../types/utils';

export module 'ramda' {

    export function head<T extends Array<any>>(list: T): ArrayEntry<T> | undefined;
    export function always<T>(data: T): () => T;

}
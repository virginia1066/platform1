import { PromiseEntry } from '../types/utils';
import dayjs, { ManipulateType } from 'dayjs';
import { equals, not, pipe } from 'ramda';

type DataStoreItem<T extends (...args: Array<any>) => Promise<any>> = {
    expired_at: number;
    data: PromiseEntry<ReturnType<T>>;
}

const make_id = (args: Array<any>) => args.map((item) => {
    switch (typeof item) {
        case 'object':
            return JSON.stringify(item);
        case 'string':
            return item;
        case 'number':
        case 'bigint':
        case 'boolean':
        default:
            return String(item);
    }
}).join('-');

export const cache = <K, T extends (...args: Array<any>) => Promise<K>>(callback: T, time: number): T => {
    const active_xhr_store: Partial<Record<string, ReturnType<T>>> = Object.create(null);
    const ready_data_store: Partial<Record<string, DataStoreItem<T>>> = Object.create(null);

    return ((...args: Array<any>) => {
        const not_undefined = args.filter(pipe(equals(undefined), not));
        const id = make_id(not_undefined);

        if (active_xhr_store[id]) {
            return active_xhr_store[id];
        }

        if (ready_data_store[id] && Date.now() < ready_data_store[id]!.expired_at) {
            return Promise.resolve(ready_data_store[id]!.data);
        }

        const request = callback(...args);
        active_xhr_store[id] = request as ReturnType<T>;

        request
            .then((data: K) => {
                const expired_at = Date.now() + time;
                delete active_xhr_store[id];
                ready_data_store[id] = Object.assign(Object.create(null), {
                    expired_at, data
                });
            })
            .catch(() => {
                delete active_xhr_store[id];
            });

        return request;
    }) as T;
};

export const make_time = (count: number, unit: ManipulateType): number => {
    const start = dayjs();
    return start.add(count, unit).diff(start, 'ms');
};
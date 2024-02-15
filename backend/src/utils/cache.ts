import { PromiseEntry } from '../types/utils';
import dayjs, { ManipulateType } from 'dayjs';

type DataStoreItem<T extends (...args: Array<any>) => Promise<any>> = {
    expire_at: number;
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

export const cache = <T extends (...args: Array<any>) => Promise<any>>(callback: T, time: number): T => {
    const active_xhr_store: Partial<Record<string, ReturnType<T>>> = Object.create(null);
    const ready_data_store: Partial<Record<string, DataStoreItem<T>>> = Object.create(null);

    return ((...args: Array<any>) => {
        const id = make_id(args);

        if (!active_xhr_store[id] && (!ready_data_store[id] || ready_data_store[id]!.expire_at < Date.now())) {
            const request = callback(...args);

            request.then((data: PromiseEntry<ReturnType<T>>) => {
                const expired_at = Date.now() + time;
                delete active_xhr_store[id];
                ready_data_store[id] = Object.assign(Object.create(null), { expired_at, data });
            });

            return request;
        }

        if (active_xhr_store[id]) {
            return active_xhr_store[id];
        }

        return Promise.resolve(ready_data_store[id]!.data);
    }) as T;
};

export const make_time = (count: number, unit: ManipulateType): number => {
    const start = dayjs();
    return start.add(count, unit).diff(start, 'ms');
};
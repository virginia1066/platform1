import { coreD } from '../models/core';
import { Func } from '../types/utils';
import { ParsedResponse, request } from './request';

const resolve = <T, R>(data: T, content: R | Func<[T], R>): R => {
    return typeof content === 'function'
        ? (content as Func<[T], R>)(data)
        : content;
};

export const make_request_fx = <T, C = any, E = any>(props: Props<T>) =>
    coreD.createEffect<T, ParsedResponse<C>, ParsedResponse<E>>((params: T) => {
        const url = resolve(params, props.url);
        const init = resolve(params, props.init ?? {});

        return request(url, init);
    });

type Fn<T> = Func<[T], string>;
type FnInit<T> = Func<[T], RequestInit>;

type Props<T> = {
    url: string | Fn<T>,
    init?: RequestInit | FnInit<T>
};
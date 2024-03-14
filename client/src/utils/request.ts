import { __, assoc, pipe } from 'ramda';
import { BASE_URL } from '../constants';
import { navigate_e } from '../models/core';

let auth_xhr: Promise<{ data: { token: string } }> | null = null;
let auth_done: boolean = false;
let token: string | null = null;


const req = <T>(url: string, init?: RequestInit): Promise<ParsedResponse<T>> =>
    fetch(`${window.location.origin}${url}`, {
        method: init?.method ?? 'GET',
        headers: Object.assign({
            'Content-Type': 'application/json',
            'X-Session-Token': token ?? void 0
        }, init?.headers ?? {}),
        ...(init ?? {})
    }).then<ParsedResponse<T>>(parse_response);

export type ParsedResponse<T> = Response & {
    data: T
};

const get_content = (r: Response) =>
    r.headers.get('Content-Type')?.toLowerCase()?.includes('application/json')
        ? r.json()
        : r.text();

const add_content = <T>(response: Response): (data: T) => ParsedResponse<T> =>
    assoc('data', __, response);

const reject = <T>(data: T) => Promise.reject(data);

export const parse_response = <T>(r: Response): Promise<ParsedResponse<T>> =>
    r.ok
        ? get_content(r)
            .then(add_content(r))
        : get_content(r)
            .then(pipe(add_content(r), reject));

const auth = () => {
    auth_xhr = req<{ token: string }>('/api/v1/web-app/user/auth', {
        method: 'POST',
        body: JSON.stringify({ auth_data: Telegram.WebApp.initData })
    }).catch(() => {
        navigate_e(`${BASE_URL}/403`);
        return { data: { token: '' } };
    });

    auth_xhr.then((response) => {
        auth_xhr = null;
        auth_done = true;
        token = response.data.token;
    });

    return auth_xhr;
};

export const request = <T>(url: string, init?: RequestInit): Promise<ParsedResponse<T>> =>
    (
        auth_done
            ? req(url, init)
            : auth_xhr
                ? auth_xhr.then(() => req(url, init))
                : auth().then(() => req(url, init))
    ) as Promise<ParsedResponse<T>>;

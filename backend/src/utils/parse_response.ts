import { Response as NodeResponse } from 'node-fetch';
import { error } from './log';

const log_error = (r: Response | NodeResponse) => (e: any) => {
    error(`Request: ${r.url} was fail! ${String(e)}`);
    return Promise.reject(e);
};

export const parse_response = <T>(r: Response | NodeResponse): Promise<T> =>
    r.ok
        ? r.headers.get('Content-Type')?.toLowerCase()?.includes('application/json')
            ? r.json()
            : r.text()
        : (
            r.headers.get('Content-Type')?.toLowerCase()?.includes('application/json')
                ? r.json().then(log_error(r))
                : r.text().then(log_error(r))
        )
            .then((text: any) => Promise.reject(text));
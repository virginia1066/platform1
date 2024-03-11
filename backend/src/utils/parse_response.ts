import { Response as NodeResponse } from 'node-fetch';

export const parse_response = <T>(r: Response | NodeResponse): Promise<T> =>
    r.ok
        ? r.headers.get('Content-Type')?.toLowerCase()?.includes('application/json')
            ? r.json()
            : r.text()
        : (
            r.headers.get('Content-Type')?.toLowerCase()?.includes('application/json')
                ? r.json()
                : r.text()
        )
            .then((text: any) => Promise.reject(text));
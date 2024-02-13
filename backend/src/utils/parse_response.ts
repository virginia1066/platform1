import { Response as NodeResponse } from 'node-fetch';

export const parse_response = (r: Response | NodeResponse) =>
    r.ok
        ? r.headers.get('Content-Type')?.toLowerCase()?.includes('application/json')
            ? r.json()
            : r.text()
        : r.text()
            .then((text: string) => Promise.reject(text));
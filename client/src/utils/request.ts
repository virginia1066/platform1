let auth_xhr: Promise<unknown> | null = null;
let auth_done: boolean = false;


const req = <T>(url: string, init?: RequestInit): Promise<ParsedResponse<T>> =>
    fetch(`${window.location.origin}${url}`, {
        method: init?.method ?? 'GET',
        headers: Object.assign({
            'Content-Type': 'application/json'
        }, init?.headers ?? {}),
        ...(init ?? {})
    }).then<ParsedResponse<T>>(parse_response);

export type ParsedResponse<T> = Response & {
    data: T
};

export const parse_response = <T>(r: Response): Promise<ParsedResponse<T>> =>
    r.ok
        ? r.headers.get('Content-Type')?.toLowerCase()?.includes('application/json')
            ? r.json()
                .then<ParsedResponse<T>>(data => ({ ...r, data }))
            : r.text()
                .then<ParsedResponse<T>>(data => ({ ...r, data }) as ParsedResponse<T>)
        : r.text()
            .then((text: string) => Promise.reject(text));

const auth = () => {
    auth_xhr = req('/api/v1/web-app/user/auth', {
        method: 'POST',
        body: JSON.stringify({ auth_data: Telegram.WebApp.initData })
    });

    auth_xhr.then(() => {
        auth_xhr = null;
        auth_done = true;
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

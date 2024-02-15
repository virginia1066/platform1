export const parse_cookie = (cookie_str: string): Record<string, string> => {
    return cookie_str.split(',').reduce((acc, cookie) => {
        if (!cookie.includes('=')) {
            return acc;
        }

        const [key_value] = cookie.split(';');
        const [key, value] = key_value.split('=');

        return Object.assign(acc, { [key]: value });
    }, Object.create(null));

};
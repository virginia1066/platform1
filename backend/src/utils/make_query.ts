export const make_query = (data: Record<string, string | number | Array<string | number>>) => {
    const query_parts = Object.entries(data).reduce((parts, [key, value]) => {
        if (Array.isArray(value)) {
            const sub_query = value.map((v) => `${key}[]=${v}`).join('&');
            parts.push(sub_query);
        } else {
            parts.push(`${key}=${value}`);
        }
        return parts;
    }, [] as Array<string>);

    return query_parts.length ? `?${query_parts.join('&')}` : '';
};
export const make_query = (data: Record<string, string | number | Array<string | number>>) => {
    const query_parts = Object.entries(data).reduce((params, [key, value]) => {
        if (Array.isArray(value)) {
            value.forEach(v => {
                params.append(key, String(v));
            });
        } else {
            params.append(key, String(value));
        }
        return params;
    }, new URLSearchParams());

    return query_parts.size ? `?${query_parts.toString()}` : '';
};
export const get_subscription_type_hash = (data: {
    groupings: Array<{
        id: number;
        name: string,
        subscriptions: Array<{ id: number }>
    }>
}) => {
    return data.groupings.reduce<Record<number, string>>((acc, item) => {
        const name = item.name;
        return item.subscriptions.reduce((acc, { id }) => {
            return Object.assign(acc, { [id]: name });
        }, acc);
    }, Object.create(null));
};
type Props = {
    event_type: string;
    props?: Record<string, string | number | undefined>
}

const get_id = () => {
    const get_local_id = () => {
        try {
            const id = localStorage.getItem('user_id') ?? crypto.randomUUID();
            localStorage.setItem('user_id', id);
            return id;
        } catch (e) {
            return crypto.randomUUID();
        }
    }

    return Telegram.WebApp.initDataUnsafe.user?.id ?? get_local_id();
}

export const send_analytics = (props: Props) =>
    fetch(`/api/v1/event/log`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: get_id(),
            event_type: props.event_type,
            event_properties: { ...(props.props ?? {}) }
        })
    }).catch(console.warn);

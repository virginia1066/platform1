type Props = {
    event_type: string;
    props?: Record<string, string | number | undefined>
}
export const send_analytics = (props: Props) =>
    fetch(`/api/v1/event/log`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: Telegram.WebApp.initDataUnsafe.user?.id ?? -1,
            event_type: props.event_type,
            event_properties: { ...(props.props ?? {}) }
        })
    }).catch(console.warn);

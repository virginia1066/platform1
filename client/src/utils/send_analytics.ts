import { AMPLITUDE_API_KEY } from '../constants';
import { init, track } from '@amplitude/analytics-browser';

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
    };

    return Telegram.WebApp.initDataUnsafe.user?.id ?? get_local_id();
};

init(AMPLITUDE_API_KEY, String(get_id()));

export const send_analytics = (props: Props) => {
    track({
        event_type: props.event_type,
        event_properties: { ...(props.props ?? Object.create(null)) }
    });
};

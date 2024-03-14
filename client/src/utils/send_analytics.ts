import { AMPLITUDE_API_KEY } from '../constants';
import { init, track } from '@amplitude/analytics-browser';
import { range } from 'ramda';

type Props = {
    event_type: string;
    props?: Record<string, string | number | undefined>
}

const generate_id = () => {
    if (window.crypto) {
        return window.crypto.randomUUID();
    }
    return range(0, 5)
        .map(() => Math.random())
        .join('-');
};

const get_id = () => {
    const get_local_id = () => {
        try {
            const id = localStorage.getItem('user_id') ?? generate_id();
            localStorage.setItem('user_id', id);
            return id;
        } catch (e) {
            return generate_id();
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

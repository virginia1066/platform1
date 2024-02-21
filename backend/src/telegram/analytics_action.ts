import { EventParams, send_amplitude_event } from '../utils/send_amplitude_event';
import { Message, User } from 'node-telegram-bot-api';

export const analytics_action = <T extends (user: User, event: Message) => any>(data: Omit<EventParams, 'user_id'>, cb: T): T =>
    ((user: User, event: Message) => {
        send_amplitude_event({ ...data, user_id: user.id });
        return cb(user, event);
    }) as T;
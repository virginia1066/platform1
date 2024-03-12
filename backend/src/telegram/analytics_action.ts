import { EventParams, send_amplitude_event } from '../utils/send_amplitude_event';
import { Message, User } from 'node-telegram-bot-api';
import { get_student_by_tg } from '../utils/get_student_by_tg';
import { warn } from '../utils/log';

export const analytics_action = <T extends (user: User, event: Message) => any>(data: Omit<EventParams, 'user_id'>, cb: T): T =>
    ((user: User, event: Message) => {
        get_student_by_tg(user.id, false)
            .then((student_id) => {
                send_amplitude_event({
                    ...data,
                    user_id: user.id,
                    event_properties: { student_id }
                }).catch(warn.bind(null, 'Send analytics event error:'));
            })
        return cb(user, event);
    }) as T;
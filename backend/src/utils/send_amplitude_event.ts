import { parse_response } from './parse_response';
import { warn } from './log';
import { always, pipe } from 'ramda';
import fetch from 'node-fetch';
import { randomUUID } from 'crypto';

export const send_amplitude_event = ({ event_type, event_properties, user_id }: EventParams) => {
    return fetch('https://api2.amplitude.com/2/httpapi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*'
        },
        body: JSON.stringify({
            'api_key': 'bf51792a31a45c4683931d13323572c8',
            'events': [{
                event_type,
                user_id: user_id === -1 ? `unknown-${randomUUID()}` : user_id,
                event_properties: event_properties
                    ? Object.assign({ from: 'server' }, event_properties)
                    : { from: 'server' }
            }]
        })
    }).then(parse_response).catch(pipe(warn.bind(null, 'Analytics error:'), always(void 0)));
};

export type EventParams = {
    user_id: number | string;
    event_type: string;
    event_properties?: Record<string, string | number | undefined>;
}
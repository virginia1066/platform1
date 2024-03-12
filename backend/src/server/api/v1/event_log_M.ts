import { Middleware } from 'koa';
import { yup_validate } from '../../../utils/yup_validate';
import { mixed, number, object, string } from 'yup';
import { send_amplitude_event } from '../../../utils/send_amplitude_event';
import { always } from 'ramda';
import { set_body } from '../../utils/set_body';
import { get_student_by_tg } from '../../../utils/get_student_by_tg';

const schema = object().shape({
    user_id: mixed((value): value is string | number => ['number', 'string'].includes(typeof value)).required(),
    event_type: string().required(),
    event_properties: object().test('event_params', (value, context) => {
        const available_types = ['string', 'number'];
        return Object.entries(value).reduce((acc, [key, value]) => {
            if (available_types.includes(typeof value)) {
                return Object.assign(acc, { [key]: value });
            }
            throw context.createError({
                path: `${context.path}.${key}`,
                message: `Wrong event param! ${key}`
            });
        }, Object.create(null));
    })
});

export const event_log_M: Middleware = (ctx, next) =>
    yup_validate(schema, ctx.request.body)
        .then(({ event_type, event_properties, user_id }) =>
            typeof user_id === 'number'
                ? get_student_by_tg(user_id)
                : Promise.resolve(void 0)
                    .then((student_id) => send_amplitude_event({
                        event_type, user_id,
                        event_properties: Object.assign(event_properties ?? Object.create(null), {
                            student_id
                        })
                    }))
                    .finally(always({ ok: true })))
        .then(set_body(ctx))
        .then(next);

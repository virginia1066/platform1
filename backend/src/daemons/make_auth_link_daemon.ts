import { get_student, GetStudentResponse, update_student, update_user_attribute } from '../utils/request_mk';
import { info } from '../utils/log';
import { generate_email } from '../utils/generate_email';
import { knex, MESSAGE_BUS, TG_LINK_ATTRIBUTE_ID } from '../constants';
import { UserFromWebhook, WebhookUserStatus } from '../types/general';
import { head, map, pipe, prop, tap } from 'ramda';

export const make_auth_link_daemon = () => {
    const add_email = (student_info: GetStudentResponse) => {
        if (student_info.email) {
            info(`Email already exist!`);
            return Promise.resolve(student_info);
        }

        const email = generate_email(student_info.id);
        info(`Generated email! ${email}`);

        return update_student(student_info.id, {
            name: student_info.name,
            email
        });
    };
    const make_auth_link = (class_user_id: number) => {
        info(`Add auth link for user ${class_user_id}`);
        return get_student({ student_id: class_user_id })
            .then(tap(info))
            .then(add_email)
            .then(tap(info))
            .then((student) => {
                return knex('users_from_webhook')
                    .select('*')
                    .where({ class_id: class_user_id })
                    .then<UserFromWebhook | undefined>(head)
                    .then((link_data) => {
                        if (!link_data) {
                            throw new Error(`Has no link data for user!`);
                        }

                        const link = `https://t.me/BeowolfScoolBot?start=${link_data.link_param}`;

                        return update_user_attribute(class_user_id, TG_LINK_ATTRIBUTE_ID, link)
                            .then(() => knex('users_from_webhook')
                                .update('attribute_status', WebhookUserStatus.Done)
                                .where('class_id', class_user_id));
                    });
            })
            .then(tap(info));
    };

    MESSAGE_BUS
        .on('user_create', ({ class_id }) => make_auth_link(class_id));

    knex('users_from_webhook')
        .select('class_id')
        .where({ attribute_status: WebhookUserStatus.Pending })
        .then(map(pipe(prop('class_id'), make_auth_link)));
};
import { Message, User } from 'node-telegram-bot-api';
import { info, warn } from '../../utils/log';
import { always, head } from 'ramda';
import { get_student, GetStudentResponse } from '../../utils/request_mk';
import { Buttons, ConfigType, ResponseItem } from '../library';
import { t } from 'i18next';
import { get_student_by_tg } from '../../utils/get_student_by_tg';
import { BaseItem } from '../library/types';
import { knex } from '../../constants';
import { UserFromWebhook } from '../../types/general';

export const get_start_message = (buttons: Buttons) => (user: User, message: Message) => {
    info(`Event from start command!: `, user, message);
    const user_link_id = head(message.text!.split(' ').slice(1));

    const success_response = (student: GetStudentResponse): ResponseItem => ({
        type: ConfigType.Text,
        text: t('telegram.start.success', { student_name: student.name }),
        buttons
    });

    return get_student_by_tg(user.id)
        .then((student_id): BaseItem | Promise<ResponseItem | BaseItem> => {

            if (student_id) {
                return get_student({ student_id: student_id })
                    .then(success_response);
            }

            info(`User is not saved in database.`);

            if (!user_link_id) {
                warn(`Has no start attribute in launch bot link!`);
                return { id: 'start-error' };
            }

            return knex('users_from_webhook')
                .select('*')
                .where('link_param', user_link_id)
                .then<UserFromWebhook | undefined>(head)
                .then((webhook_data) => {

                    if (!webhook_data) {
                        warn(`Can't find user with start param from link!`);
                        return { id: 'start-error' };
                    }

                    return knex('tg_users')
                        .insert({ tg_id: user.id, mk_id: webhook_data.class_id })
                        .then(() => get_student({ student_id: webhook_data.class_id }))
                        .then(success_response);
                });
        })
        .catch(always({ id: 'start-error' }));
};

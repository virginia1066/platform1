import { update_user_attribute } from '../utils/request_mk';
import { info, warn } from '../utils/log';
import { knex, MESSAGE_BUS, TG_BOT_NAME, TG_LINK_ATTRIBUTE_ID } from '../constants';
import { UserFromWebhook, WebhookUserStatus } from '../types/general';
import { head, prop } from 'ramda';
import { ckeck_users_attributes } from '../utils/ckeck_users_attributes';
import { asyncMap } from '@tsigel/async-map';
import { wait } from '../utils/wait';

export const make_auth_link_daemon = () => {
    const make_auth_link = (class_user_id: number) => {
        info(`Add auth link for user ${class_user_id}`);

        return knex('users_from_webhook')
            .select('*')
            .where({ class_id: class_user_id })
            .then<UserFromWebhook | undefined>(head)
            .then((link_data) => {

                if (!link_data) {
                    throw new Error(`Has no link data for user!`);
                }

                const link = `https://t.me/${TG_BOT_NAME}?start=${link_data.link_param}`;

                const update_loop = (retry_count: number): Promise<unknown> => {
                    const stringify_error = (e: any): string => {
                        const tpl = (str: string) => `Can't update user attribute: ${str}`;
                        if ('message' in e) {
                            return tpl(e.message);
                        } else {
                            try {
                                return tpl(JSON.stringify(e, null, 4));
                            } catch (e) {
                                return tpl(String(e));
                            }
                        }
                    }

                    return update_user_attribute(class_user_id, TG_LINK_ATTRIBUTE_ID, link)
                        .catch((e) => {
                            if (retry_count > 10) {
                                throw new Error(stringify_error(e));
                            } else {
                                warn(`Update attr error (try count ${retry_count + 1}):`, stringify_error(e));
                            }
                            return wait((retry_count + 1) * 500)
                                .then(() => update_loop(retry_count + 1));
                        });
                };

                return update_loop(0)
                    .then(() => knex('users_from_webhook')
                        .update('attribute_status', WebhookUserStatus.Done)
                        .where('class_id', class_user_id));
            });
    };

    MESSAGE_BUS
        .on('user_create', ({ class_id }) => make_auth_link(class_id));

    return ckeck_users_attributes()
        .then(() => {
            knex('users_from_webhook')
                .select('class_id')
                .where({ attribute_status: WebhookUserStatus.Pending })
                .then(list => asyncMap(1, make_auth_link, list.map(prop('class_id'))));
        });
};
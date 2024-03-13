import { knex } from '../constants';
import { UserFromWebhook, WebhookUserStatus } from '../types/general';
import { make_id } from './make_id';
import { randomUUID } from 'crypto';

export const make_link_params = (id_list: List) =>
    id_list.length
        ? knex('users_from_webhook')
            .insert(id_list.map(({ class_id, user_created_at }) => ({
                class_id, user_created_at,
                attribute_status: WebhookUserStatus.Pending,
                link_param: make_id(`link-${class_id}-${randomUUID()}`)
            })))
            .onConflict('class_id')
            .ignore()
            .returning('*')
        : Promise.resolve([]);

type List = Array<Pick<UserFromWebhook, 'class_id' | 'user_created_at'>>;

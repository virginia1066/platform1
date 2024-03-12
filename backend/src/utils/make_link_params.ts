import { knex } from '../constants';
import { WebhookUserStatus } from '../types/general';
import { make_id } from './make_id';
import { randomUUID } from 'crypto';

export const make_link_params = ({ users }: Props) =>
    knex('users_from_webhook')
        .insert(users.map(({ userId }) => ({
            class_id: userId,
            attribute_status: WebhookUserStatus.Pending,
            link_param: make_id(`link-${userId}-${randomUUID()}`)
        })))
        .onConflict('class_id')
        .ignore()
        .returning('*')

type Props = {
    users: Array<{ userId: number }>
}
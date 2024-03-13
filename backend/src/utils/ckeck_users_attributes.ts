import { get_student_list, update_user_attribute } from './request_mk';
import { make_link_params } from './make_link_params';
import { head, propEq } from 'ramda';
import { knex, TG_BOT_NAME, TG_LINK_ATTRIBUTE_ID } from '../constants';
import { UserFromWebhook, WebhookUserStatus } from '../types/general';
import dayjs from 'dayjs';

const LIMIT = 100;

export const ckeck_users_attributes = () => {
    const loop = (start_form: string, offset: number): Promise<unknown> => {
        return get_student_list({
            offset,
            limit: LIMIT,
            sort: 'createdAt',
            sortDirection: 'asc',
            createdAt: [start_form, dayjs().add(1, 'day').toISOString()]
        }).then(({ users }) => {
            if (!users.length) {
                return Promise.resolve();
            }

            const get_link_param = (value: string): { start: string; bot_name: string } | null => {
                try {
                    const url = new URL(value);
                    const start = url.searchParams.get('start');
                    const bot_name = url.pathname.substring(1);

                    return start && bot_name
                        ? ({ start, bot_name }) : null;
                } catch (e) {
                    return null;
                }
            };

            const data = users.reduce<Acc>((acc, user) => {
                const attr = user.attributes.find(propEq(TG_LINK_ATTRIBUTE_ID, 'attributeId'));
                const link_param = attr ? get_link_param(attr.value) : null;

                if (link_param && link_param.bot_name !== TG_BOT_NAME) {
                    acc.to_update_bot_name.push({
                        class_id: user.id,
                        user_created_at: user.createdAt,
                        attribute_status: WebhookUserStatus.Done,
                        link_param: link_param.start,
                        link: `https://t.me/${TG_BOT_NAME}?start=${link_param.start}`
                    });
                } else if (link_param) {
                    acc.to_check_attribute.push({
                        class_id: user.id,
                        user_created_at: user.createdAt,
                        attribute_status: WebhookUserStatus.Done,
                        link_param: link_param.start
                    });
                } else {
                    acc.to_make_params.push({ class_id: user.id, user_created_at: user.createdAt });
                }

                return acc;
            }, { to_make_params: [], to_check_attribute: [], to_update_bot_name: [] });

            return Promise.all([
                make_link_params(data.to_make_params),
                data.to_check_attribute.length
                    ? knex('users_from_webhook')
                        .insert(data.to_check_attribute)
                        .onConflict()
                        .ignore()
                    : Promise.resolve(),
                Promise.all(data.to_update_bot_name.map(({ link, ...props }) =>
                    update_user_attribute(props.class_id, TG_LINK_ATTRIBUTE_ID, link)
                        .then(() =>
                            knex('users_from_webhook')
                                .insert(props)
                                .onConflict('class_id')
                                .merge()
                        )))
            ])
                .then(() => {
                    if (users.length < LIMIT) {
                        return Promise.resolve();
                    }
                    return loop(start_form, offset + users.length);
                });
        });
    };

    return knex('users_from_webhook')
        .select('*')
        .orderBy('user_created_at', 'desc')
        .limit(1)
        .then<UserFromWebhook | undefined>(head)
        .then((user) => {
            const from = user?.user_created_at
                ? dayjs(user!.user_created_at).startOf('day').toISOString()
                : dayjs().subtract(10, 'years').startOf('year').toISOString();

            return loop(from, 0);
        });
};

type Acc = {
    to_make_params: Array<Pick<UserFromWebhook, 'class_id' | 'user_created_at'>>;
    to_check_attribute: Array<UserFromWebhook>;
    to_update_bot_name: Array<UserFromWebhook & { link: string; }>;
}

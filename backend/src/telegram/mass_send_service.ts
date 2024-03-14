import { knex, MASS_SEND_CHANNEL_ID, TG } from '../constants';
import { error, info, warn } from '../utils/log';
import dayjs from 'dayjs';
import { AdminMessageStatus } from '../types/general';
import { interval } from '../utils/interval';
import { make_time } from '../utils/cache';
import { asyncMap } from '@tsigel/async-map';
import { wait } from '../utils/wait';

export const mass_send_service = () => {
    TG.on('channel_post', (message) => {
        info(`Event from "channel_post":`, message);

        if (message.chat.id !== MASS_SEND_CHANNEL_ID) {
            return void 0;
        }

        knex('mass_send_tg')
            .insert({
                created_at: dayjs().toISOString(),
                updated_at: dayjs().toISOString(),
                status: AdminMessageStatus.Pending,
                message_id: message.message_id,
            })
            .then(() => {
                info(`Add new message to mass send!`);
            })
            .catch((e) => {
                error(`Error add message for mass send!`, e, message);
            });
    });

    TG.on('edited_channel_post', (message) => {
        info(`Event from "edited_channel_post":`, message);

        if (message.chat.id !== MASS_SEND_CHANNEL_ID) {
            return void 0;
        }

        knex('mass_send_tg')
            .update('updated_at', dayjs().toISOString())
            .where('message_id', message.message_id)
            .then(() => {
                info(`Update done.`);
            })
            .catch(() => {
                error(`Update fail!`, message);
            });
    });

    interval(() =>
            Promise
                .all([
                    knex('mass_send_tg')
                        .where('created_at', '>=', dayjs().subtract(15, 'minutes').toISOString())
                        .where('status', AdminMessageStatus.Pending),
                    knex('tg_users')
                ])
                .then(([list, users]) => asyncMap(1, (message) => {
                    const send = (id: number, chat_id: number, message_id: number): Promise<unknown> =>
                        TG.copyMessage(id, chat_id, message_id)
                            .catch((e: any) => {
                                if (e.response.statusCode === 429) {
                                    info(`Too many requests to telegram!`);
                                    return wait(5_000)
                                        .then(() => send(id, chat_id, message_id));
                                }
                                if (e.response.statusCode === 400) {
                                    warn(`Message was deleted or can't send!`, e.message);
                                    return void 0;
                                }
                                error(e);
                                return Promise.reject(e);
                            });

                    return asyncMap(1, (message) => {
                        return asyncMap(5, ({ tg_id }) =>
                            send(tg_id, MASS_SEND_CHANNEL_ID, message.message_id), users);
                    }, list)
                        .then(() =>
                            knex('mass_send_tg')
                                .update('status', AdminMessageStatus.Done)
                                .where('message_id', message.message_id));
                }, list))
        , make_time(1, 'minutes'));
};
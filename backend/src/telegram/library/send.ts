import TelegramBot, { Message, SendMessageOptions } from 'node-telegram-bot-api';
import { error, warn } from '../../utils/log';
import { wait } from '../../utils/wait';
import { make_time } from '../../utils/cache';

export const send = (tg: TelegramBot, user_id: number, message: string, options: SendMessageOptions): Promise<Message> =>
    tg.sendMessage(user_id, message, options)
        .catch((e: any) => {
            if (e.response.statusCode === 429) {
                warn(`Too many requests to telegram API!`);
                return wait(make_time(2, 'seconds'))
                    .then(() => send(tg, user_id, message, options));
            }
            error(`Can't send telegram message!`, e);
            return Promise.reject(e);
        });
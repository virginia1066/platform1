import * as TelegramBot from 'node-telegram-bot-api';
import { Message, User } from 'node-telegram-bot-api';
import {
    BaseItem,
    Buttons,
    CommandItem,
    Config,
    ConfigType,
    Dynamic,
    DynamicEntryTypes,
    Resolve,
    ResponseItem
} from './types';
import { curry, indexBy, prop, propEq } from 'ramda';
import { isCommand, isFunction, isPromise } from './utils';
import { resolveResponse } from './resolveDynamic';
import { randomUUID } from 'crypto';
import { info } from '../../utils/log';
import { MessageSpliter } from '../../services/MessageSpliter';
import { iterate } from './iterate';
import { send } from './send';

export { ConfigType, ResponseItem, Buttons, Button } from './types';

export const bot = (tg: TelegramBot, config: Config) => {
    const tree = indexBy(prop('id'), config.actions);
    const store: Partial<Partial<Record<string, Record<string, Dynamic<ResponseItem | BaseItem>>>>> = Object.create(null);
    const resolve = resolveResponse(tree);
    const getUser = (message: Message): User => message.from!;

    const commands = config.actions.filter(isCommand);

    tg.setMyCommands(
        commands
            .filter(propEq(true, 'showInMenu'))
            .map((command) => {
                return {
                    command: command.id,
                    description: command.description
                };
            })
    );

    const makeId = () => randomUUID();

    const bind = (id: string, user: User, action: Dynamic<ResponseItem | BaseItem>) => {
        if (!store[user.id]) {
            store[user.id] = Object.create(null);
        }
        if (!store[user.id]![id]) {
            store[user.id]![id] = action;
        }
        return id;
    };
    const clear = (user: User) => {
        delete store[user.id];
    };

    const dynamic = <T extends DynamicEntryTypes>(message: Message, item: Dynamic<T>): Promise<Resolve<T>> => {
        if (isFunction(item)) {
            const res = item(getUser(message), message);

            return isPromise(res)
                ? res.then(resolve)
                : Promise.resolve(resolve(res));
        } else {
            return Promise.resolve(resolve(item));
        }
    };

    const loadButtons = (message: Message, buttons: Buttons): Promise<Buttons<string>> =>
        Promise
            .all(buttons.map((line) =>
                Promise.all(line.map((button) => {
                    return dynamic(message, button.text)
                        .then((text) => ({ ...button, text }));
                }))));

    const sendResponseItem = curry((message: Message, response: ResponseItem) => {
        const user = getUser(message);
        return Promise
            .all([
                dynamic(message, response.text),
                dynamic(message, response.buttons ?? [[]])
                    .then((buttons) => loadButtons(message, buttons))
            ])
            .then(([text, buttons]): Promise<unknown> => {
                const keyboard = {
                    keyboard: buttons.map((line) => line.map((item) => {
                        bind(item.text, user, item.action);
                        return ({
                            text: item.text
                        });
                    })),
                    one_time_keyboard: false,
                    resize_keyboard: true
                };
                if (text instanceof MessageSpliter) {
                    const messages = text.get_messages();

                    return iterate((message: string, is_last: boolean) => {
                        return send(tg, user.id, message, {
                            parse_mode: config.parseMode,
                            disable_web_page_preview: true,
                            reply_markup: is_last ? keyboard : {
                                keyboard: [[]],
                                one_time_keyboard: true,
                                resize_keyboard: true
                            }
                        });
                    }, messages);
                } else {
                    return send(tg, user.id, text, {
                        parse_mode: config.parseMode,
                        disable_web_page_preview: true,
                        reply_markup: keyboard
                    });
                }
            });
    });

    tg.on('inline_query', (message) => {
        info(`Inline query:`, message);
    });

    tg.on('callback_query', (message) => {
        info(`Callback query:`, message);
    });

    tg.on('message', (message) => {
        info(`Message:`, message);

        const user = message.from;

        if (!message.text) {
            return void 0;
        }

        if (user && store[user.id] && store[user.id]![message.text]) {
            const action = store[user.id]![message.text];

            clear(user);

            return dynamic(message, action)
                .then(resolve)
                .then(sendResponseItem(message));
        }

        const isCommand = message.text.startsWith('/');
        const command = message.text.split(' ')[0]
            .replace('/', '');

        if (isCommand) {
            const commandItem = tree[command];
            info(`Launch command:`, commandItem);

            if (!commandItem || commandItem.type !== ConfigType.Command) {
                return dynamic(message, config.unknownMessage)
                    .then(sendResponseItem(message));
            }

            return dynamic(message, (commandItem as CommandItem).action)
                .then(sendResponseItem(message));
        }

        return dynamic(message, config.unknownMessage)
            .then(sendResponseItem(message));
    });
};

export default bot;
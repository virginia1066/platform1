import { Message, SendMessageOptions, User } from 'node-telegram-bot-api';
import { MessageSpliter } from '../../services/MessageSpliter';

export enum ConfigType {
    Text = 'text',
    Command = 'command'
}

export type DynamicEntryTypes =
    string | MessageSpliter | BaseItem | ResponseItem | Buttons;

export type Dynamic<T, E = Message> = ((user: User, event: E) => T | Promise<T>) | T;

export type Resolve<T extends DynamicEntryTypes> =
    T extends BaseItem
        ? ResponseItem : T

export type BaseItem = {
    id: string;
}

export type Button<Text = Dynamic<string>> = {
    text: Text;
    action: Dynamic<BaseItem | ResponseItem>;
}

export type ResponseItem = {
    type: ConfigType.Text;
    text: Dynamic<string | MessageSpliter>;
    buttons?: Dynamic<Buttons>;
}

export type CommandItem = {
    type: ConfigType.Command;
    description: string;
    showInMenu: boolean;
    action: Dynamic<ResponseItem | BaseItem>;
};

export type ConfigItem = ResponseItem | CommandItem;
export type RootItem = (ResponseItem | CommandItem) & BaseItem;

export type Config = {
    parseMode: SendMessageOptions['parse_mode'];
    actions: Array<RootItem>;
    unknownMessage: Dynamic<ResponseItem | BaseItem>;
};

export type Buttons<T = Dynamic<string>> = Array<Array<Button<T>>>;


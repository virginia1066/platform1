import { MAX_TG_MESSAGE_LENGTH } from '../constants';

export class MessageSpliter {

    private readonly separator: string;
    private readonly message_list: Array<string | MessageSpliter>;

    constructor(message_list: Array<string | MessageSpliter>, separator: string) {
        this.message_list = message_list;
        this.separator = separator;
    }

    public get_messages(): Array<string> {
        const messages: Array<string> = [];
        let active_message_index = 0;
        for (let i = 0; i < this.message_list.length; i++) {
            const item = this.message_list[i];
            if (item instanceof MessageSpliter) {
                messages.push(...item.get_messages());
                active_message_index = messages.length;
            } else {
                const active_message = messages[active_message_index];
                const tmp_message = active_message == null
                    ? item
                    : [active_message, item].join(this.separator);

                if (tmp_message.length > MAX_TG_MESSAGE_LENGTH) {
                    messages.push(item)
                    active_message_index = messages.length - 1;
                } else {
                    messages[active_message_index] = tmp_message;
                }
            }
        }
        return messages
            .filter(Boolean);
    }

}
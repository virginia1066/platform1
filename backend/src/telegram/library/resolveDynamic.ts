import { ConfigItem, ConfigType, DynamicEntryTypes, Resolve, ResponseItem } from './types';
import { isBaseItem, isResponseItem } from './utils';
import { curry } from 'ramda';
import { MessageSpliter } from '../../services/MessageSpliter';

export const resolveResponse: IResolveResponse = curry((tree: Record<string, ConfigItem>, data: DynamicEntryTypes): Resolve<DynamicEntryTypes> => {
    if (typeof data === 'string') {
        return data as Resolve<string>;
    } else if (data instanceof MessageSpliter) {
        return data as Resolve<MessageSpliter>;
    } else if (isResponseItem(data)) {
        return data as Resolve<ResponseItem>;
    } else if (isBaseItem(data)) {
        const item = tree[data.id];

        if (!item || item.type !== ConfigType.Text) {
            throw new Error(`Wrong id! ${data.id}`);
        }

        return item;
    }
    return data;
}) as IResolveResponse;

interface IResolveResponse {
    // (tree: Record<string, ConfigItem>): (data: string) => string;
    //
    // (tree: Record<string, ConfigItem>): (data: ResponseItem | BaseItem) => ResponseItem;
    //
    // (tree: Record<string, ConfigItem>): (data: Buttons) => Buttons;

    (tree: Record<string, ConfigItem>): <T extends DynamicEntryTypes>(data: T) => Resolve<T>;

    // (tree: Record<string, ConfigItem>, data: string): string;
    //
    // (tree: Record<string, ConfigItem>, data: ResponseItem | BaseItem): ResponseItem;
    //
    // (tree: Record<string, ConfigItem>, data: Buttons): Buttons;

    <T extends DynamicEntryTypes>(tree: Record<string, ConfigItem>, data: T): Resolve<T>;
}
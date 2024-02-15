import { BaseItem, CommandItem, ConfigItem, ConfigType, ResponseItem, RootItem } from './types';

export const isPromise = (data: any): data is Promise<any> =>
    typeof data === 'object' && ['then', 'catch'].every((method) => method in data && typeof data[method] === 'function');

export const isFunction = (data: any): data is ((...args: Array<any>) => any) => {
    return typeof data === 'function';
};

export const isBaseItem = (data: any): data is BaseItem => {
    return typeof data === 'object' && typeof data['id'] === 'string';
};

export const isResponseItem = (data: any): data is ResponseItem => {
    return isBaseItem(data) && 'type' in data && data.type === ConfigType.Text;
};

export const isCommand = (data: RootItem): data is (CommandItem & BaseItem) => {
    return data.type === ConfigType.Command;
}

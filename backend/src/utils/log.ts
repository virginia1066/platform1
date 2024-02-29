import chalk from 'chalk';
import dayjs from 'dayjs';
import { DEBUG_MODE } from '../constants';

const serialize = (data: any) => {
    switch (typeof data) {
        case 'number':
        case 'string':
        case 'symbol':
            return data;
        case 'function':
            return String(data);
        default:
            if (data instanceof Error) {
                return String(data);
            }
            return JSON.stringify(data, null, 4);
    }
};

const get_from = () => {
    try {
        throw new Error();
    } catch (e: any) {
        return e.stack
            .split(' at ')
            .slice(1)
            .map((stack: string) => stack.trim())
            .filter((stack: string) => !(
                stack.includes('node_modules') ||
                stack.includes('node:internal') ||
                stack.includes('utils/log')
            ))
            .join('\n');
    }
};

const out = (isError: boolean, formatter: (message: string) => string, data: Array<any>) => {
    const message = data.map(serialize).join(' ');
    const method = isError ? 'error' : 'log';
    const now = dayjs();
    const from = DEBUG_MODE
        ? `From: ${formatter(get_from())}`
        : '';
    console[method](`${now.format('DD.MM.YYYY HH:mm:ss')}: `, formatter(message), '\n' + from);
};

export const log = (...data: Array<any>) => out(false, chalk.white, data);

export const info = (...data: Array<any>) => out(false, chalk.blue, data);

export const warn = (...data: Array<any>) => out(false, chalk.yellow, data);

export const error = (...data: Array<any>) => out(true, chalk.red, data);
import { config } from 'dotenv';
import { RequestQueue } from './services/RequestQueue';
import { get_env_strict } from './utils/get_env_prop';
import Knex from 'knex';
import { pipe } from 'ramda';
import { join } from 'node:path';
import { EventEmitter } from 'typed-ts-events';
import { MessageBussEvents } from './types/events';
import { error, info, warn } from './utils/log';
import TelegramBot from 'node-telegram-bot-api';
import { init } from 'i18next';
import locale from '../locales/ru/locale.json';
import 'dayjs/locale/ru.js';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import { BigNumber } from '@waves/bignumber';

dayjs.locale('ru');
dayjs.extend(customParseFormat);

config({
    path: join(__dirname, '..', '.env')
});

BigNumber.config.set({
    FORMAT: {
        groupSeparator: ' '
    }
});

export const ROOT_PATH = join(__dirname, '..');

const DEBUG = get_env_strict('DEBUG_MODE', pipe(Number, Boolean));

const CLASS_RPS = get_env_strict('CLASS_RPS', Number);
const TG_TOKEN = get_env_strict('TG_TOKEN');

export const TG = new TelegramBot(TG_TOKEN, {
    polling: true
});
export const TG_BOT_NAME = get_env_strict('TG_BOT_NAME');
export const TG_LINK_ATTRIBUTE_ID = get_env_strict('TG_LINK_ATTRIBUTE_ID', Number);
export const SERVER_PORT = get_env_strict('SERVER_PORT', Number);
export const REQUEST_QUEUE = new RequestQueue(CLASS_RPS);
export const MY_CLASS_API_KEY = get_env_strict('MY_CLASS_API_KEY');
export const MK_MASTER_PASSWORD = get_env_strict('MK_MASTER_PASSWORD');
export const MK_SITE_ORIGIN = get_env_strict('MK_SITE_ORIGIN');
export const TG_MK_ADMIN_USER = get_env_strict('TG_MK_ADMIN_USER');
export const GOOGLE_SHEETS_API_KEY = get_env_strict('GOOGLE_SHEETS_API_KEY');
export const GOOGLE_SHEETS_ID = get_env_strict('GOOGLE_SHEETS_ID');
export const MK_DATE_PATTERN = 'YYYY-MM-DD';
export const MAX_TG_MESSAGE_LENGTH = 1_024;
export const OFFLINE_FILIAL_ID = 30082;
export const SYSTEM_PACK_ID = 0;
export const MESSAGE_BUS = new EventEmitter<MessageBussEvents>(error);

init({
    lng: 'ru',
    debug: DEBUG,
    ns: ['translation'],
    defaultNS: 'translation',
    resources: {
        ru: {
            translation: locale
        }
    }
});

export const knex = Knex({
    client: 'pg',
    debug: DEBUG,
    connection: {
        host: get_env_strict('DB_HOST'),
        user: get_env_strict('DB_USER'),
        database: 'postgres',
        password: get_env_strict('DB_PASS'),
        port: get_env_strict('DB_PORT', Number)
    },
    pool: {
        min: 0,
        max: get_env_strict('DB_MAX_CONNECTIONS', Number)
    },
    log: {
        warn,
        debug: info,
        error,
        deprecate: warn,
        enableColors: false,
    }
});
import { config } from 'dotenv';
import { RequestQueue } from './services/RequestQueue';
import { get_env_strict } from './utils/get_env_prop';
import Knex from 'knex';
import { pipe } from 'ramda';
import { join } from 'node:path';
import { EventEmitter } from 'typed-ts-events';
import { MessageBussEvents } from './types/events';
import { error, info, warn } from './utils/log';

config({
    path: join(__dirname, '..', '.env')
});

const CLASS_RPS = get_env_strict('CLASS_RPS', Number);
const TG_TOKEN = get_env_strict('TG_TOKEN');

export const TG_LINK_ATTRIBUTE_ID = get_env_strict('TG_LINK_ATTRIBUTE_ID', Number);
export const SERVER_PORT = get_env_strict('SERVER_PORT', Number);
export const REQUEST_QUEUE = new RequestQueue(CLASS_RPS);
export const MY_CLASS_API_KEY = get_env_strict('MY_CLASS_API_KEY');
export const MESSAGE_BUS = new EventEmitter<MessageBussEvents>(error);

export const knex = Knex({
    client: 'pg',
    debug: get_env_strict('DEBUG_MODE', pipe(Number, Boolean)),
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
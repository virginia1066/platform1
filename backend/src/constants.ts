///<reference path="db/tables.d.ts"/>

import { RequestQueue } from './services/RequestQueue';
import { get_env_strict } from './utils/get_env_prop';
import { config } from 'dotenv';
import { join } from 'node:path';
import Knex from 'knex';
//
// config({
//     path: join(__dirname, '..', '.env')
// });

const CLASS_RPS = Number(get_env_strict('CLASS_RPS'));
const TG_TOKEN = get_env_strict('TG_TOKEN');
export const SERVER_PORT = Number(get_env_strict('SERVER_PORT'));
export const REQUEST_QUEUE = new RequestQueue(CLASS_RPS);

export const knex = Knex({
    client: 'pg',
    debug: Boolean(Number(get_env_strict('DEBUG_MODE'))),
    connection: {
        host: get_env_strict('DB_HOST'),
        user: get_env_strict('DB_USER'),
        database: 'postgres',
        password: get_env_strict('DB_PASS'),
        port: Number(get_env_strict('DB_PORT'))
    },
    pool: {
        min: 0,
        max: Number(get_env_strict('DB_MAX_CONNECTIONS'))
    }
});
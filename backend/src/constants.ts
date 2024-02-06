import { RequestQueue } from './services/RequestQueue';
import { get_env_strict } from './utils/get_env_prop';
import { config } from 'dotenv';
import { join } from 'node:path';

config({
    path: join(__dirname, '..', '.env')
});

const CLASS_RPS = Number(get_env_strict('CLASS_RPS'));
const TG_TOKEN = get_env_strict('TG_TOKEN');

export const request_queue = new RequestQueue(CLASS_RPS);
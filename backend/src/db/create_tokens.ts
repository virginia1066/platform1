import { knex } from '../constants';
import { info } from '../utils/log';

export const create_tokens = () =>
    knex.schema.hasTable('access_tokens')
        .then(exists => {
            if (exists) {
                return void 0;
            }

            return knex.schema.createTable('access_tokens', builder => {
                builder.string('token', 500).primary();
                builder.datetime('expiredAt', { useTz: true }).notNullable();
            });
        })
        .then(() => info(`'access_tokens' table initialized!`));;
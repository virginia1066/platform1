import { knex } from '../constants';

export const create_users = () =>
    knex.schema.hasTable('users')
        .then(exists => {
            if (exists) {
                return void 0;
            }

            return knex.schema.createTable('users', builder => {
                builder.integer('class_id').unique().notNullable();
                builder.integer('telegram_id').unique().notNullable();
                builder.string('telegram_start_link', 100).unique().notNullable();
            });
        });
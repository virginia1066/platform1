import { knex } from '../constants';

export const create_users = () =>
    knex.schema.hasTable('users_from_webhook')
        .then(exists => {
            if (exists) {
                return void 0;
            }

            return knex.schema.createTable('users_from_webhook', builder => {
                builder.integer('class_id').unique().notNullable();
                builder.string('link_param', 100).unique().notNullable();
                builder.string('attribute_status', 10).notNullable();
            });
        });
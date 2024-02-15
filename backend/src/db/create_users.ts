import { check_table } from './utils/check_table';

export const create_users = () =>
    check_table('users_from_webhook', builder => {
        builder.integer('class_id').unique().notNullable();
        builder.string('link_param', 100).unique().notNullable();
        builder.string('attribute_status', 10).notNullable();
    });
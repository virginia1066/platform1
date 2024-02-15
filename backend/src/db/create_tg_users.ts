import { check_table } from './utils/check_table';

export const create_tg_users = () =>
    check_table('tg_users', builder => {
        builder.integer('tg_id').primary();
        builder.integer('mk_id').notNullable().unique();

        builder.unique(['tg_id', 'mk_id']);
    });
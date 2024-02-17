import { check_table } from './utils/check_table';

export const create_wokobular_tables = () =>
    Promise
        .all([
            check_table('packs', (builder) => {
                builder.string('name', 50).notNullable();
                builder.increments('id').notNullable();
                builder.integer('parent_user_id').notNullable();

                builder.index('parent_user_id');
            }),
            check_table('pack_links', (builder) => {
                builder.integer('pack_id').notNullable();
                builder.string('word_id', 50).notNullable();

                builder.unique(['pack_id', 'word_id']);
            }),
            check_table('words', builder => {
                builder.increments('id').notNullable();
                builder.string('ru', 100).notNullable();
                builder.string('en', 100).notNullable();
                builder.string('status', 10).notNullable();

                builder.index(['id', 'status']);
                builder.unique(['ru', 'en']);
            })
        ]);
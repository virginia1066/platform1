import { check_table } from './utils/check_table';
import { WORD_CONFLICT_COLUMNS } from '../constants';

export const create_wokobular_tables = () =>
    Promise
        .all([
            check_table('packs', (builder) => {
                builder.string('name', 50).notNullable();
                builder.increments('id').notNullable();
                builder.integer('parent_user_id').notNullable();
                builder.string('status', 20).notNullable()
                builder.boolean('user_can_edit').notNullable();
                builder.string('insert_id', 50).notNullable();

                builder.index('parent_user_id');
            }),
            check_table('pack_links', (builder) => {
                builder.integer('pack_id').notNullable();
                builder.integer('word_id').notNullable();
                builder.string('insert_id', 50).notNullable();

                builder.unique(['pack_id', 'word_id']);
                builder.index('pack_id');
            }),
            check_table('words', builder => {
                builder.increments('id').notNullable();
                builder.string('ru', 100).notNullable();
                builder.string('en', 100).notNullable();
                builder.string('status', 10).notNullable();
                builder.string('source', 20).notNullable();
                builder.string('insert_id', 50).notNullable();

                builder.index(['id', 'status']);
                builder.unique(WORD_CONFLICT_COLUMNS);
            }),
            check_table('learn_cards', builder => {
                builder.integer('word_id').notNullable();
                builder.integer('student_id').notNullable();
                builder.timestamp('due', { useTz: true }).notNullable();
                builder.decimal('stability').notNullable();
                builder.decimal('difficulty').notNullable();
                builder.decimal('elapsed_days').notNullable();
                builder.decimal('scheduled_days').notNullable();
                builder.integer('reps').notNullable();
                builder.integer('lapses').notNullable();
                builder.integer('state').notNullable();
                builder.timestamp('last_review', { useTz: true }).notNullable();

                builder.unique(['word_id', 'student_id']);
                builder.index(['word_id', 'student_id']);
            }),
            check_table('lesson_updates', builder => {
                builder.integer('lesson_id').notNullable();
                builder.string('insert_id', 50).notNullable();
                builder.timestamp('timestamp', { useTz: true }).notNullable();
            })
        ]);
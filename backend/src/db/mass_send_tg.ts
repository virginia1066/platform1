import { check_table } from './utils/check_table';

export const mass_send_tg = () =>
    check_table('mass_send_tg', builder => {
        builder.integer('message_id').notNullable().unique();
        builder.datetime('created_at', { useTz: true }).notNullable();
        builder.datetime('updated_at', { useTz: true }).notNullable();
        builder.string('status', 10).notNullable();
    });
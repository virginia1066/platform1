import { check_table } from './utils/check_table';

export const create_subscription_notify = () =>
    check_table('subscription_notify', (builder) => {
        builder.datetime('created_at', { useTz: true }).notNullable().unique();
        builder.integer('subscription_id').notNullable();
        builder.integer('student_id').notNullable();
        builder.string('notify_status', 20).notNullable();
        builder.string('snd_date').notNullable();
        builder.datetime('end_date', { useTz: true }).notNullable();
    });
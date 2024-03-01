import { check_table } from './utils/check_table';

export const create_wh_home_task = () =>
    check_table('home_task_webhook', (builder) => {
        builder.integer('lesson_id', 50).notNullable().unique();
        builder.string('status', 20).notNullable();
    });
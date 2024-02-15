import { check_table } from './utils/check_table';

export const create_tokens = () =>
    check_table('company_access_tokens', builder => {
        builder.string('token', 500).notNullable();
        builder.datetime('expiredAt', { useTz: true }).notNullable();
    });
import Knex from 'knex';
import { info } from './log';

export const log_query = <T extends Knex.Knex.QueryBuilder>(builder: T): T => {
    info(`PG query:`, '\n' + builder.toQuery());
    return builder;
};
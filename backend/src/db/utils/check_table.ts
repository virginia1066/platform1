import { Tables } from 'knex/types/tables';
import Knex from 'knex';
import { knex } from '../../constants';
import { info } from '../../utils/log';

export const check_table = <T extends keyof Tables>(name: T, create: (builder: Knex.Knex.TableBuilder) => void) => {
    return knex.schema.hasTable(name)
        .then((exists) => {
            if (exists) {
                info(`Table "${name}" already exist!`);
                return void 0;
            }

            return knex.schema.createTable(name, create)
                .then(() => info(`Table "${name}" created!`));
        });
};
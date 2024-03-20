import { knex } from '../../constants';
import { prop } from 'ramda';

export const delete_old_info = (lesson_id: number): Promise<unknown> => {
    return knex('lesson_updates')
        .select('insert_id')
        .where('lesson_id', lesson_id)
        .then((update_list) => {
            if (!update_list.length) {
                return void 0;
            }

            const id_list = update_list.map(prop('insert_id'));

            return Promise
                .all([
                    knex('packs')
                        .where('insert_id', 'in', id_list)
                        .del(),
                    knex('pack_links')
                        .where('insert_id', 'in', id_list)
                        .del(),
                    knex('words')
                        .where('insert_id', 'in', id_list)
                        .del()
                ]);
        });
};
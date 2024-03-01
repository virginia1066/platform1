import { knex } from '../../constants';
import { LessonUpdate } from '../../types/Wokobular';
import { head, prop } from 'ramda';
import { log_query } from '../../utils/log_query';

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
                    log_query(
                        knex('packs')
                            .where('insert_id', 'in', id_list)
                            .del()
                    ),
                    log_query(
                        knex('pack_links')
                            .where('insert_id', 'in', id_list)
                            .del()
                    ),
                    log_query(
                        knex('words')
                            .where('insert_id', 'in', id_list)
                            .del()
                    )
                ]);
        });
};
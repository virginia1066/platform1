import { knex } from '../../constants';
import { LessonUpdate } from '../../types/Wokobular';
import { head } from 'ramda';
import { log_query } from '../../utils/log_query';

export const delete_old_info = (lesson_id: number): Promise<unknown> => {
    return knex('lesson_updates')
        .select('insert_id')
        .where('lesson_id', lesson_id)
        .orderBy('timestamp', 'desc')
        .limit(1)
        .then<LessonUpdate | undefined>(head)
        .then((update) => {
            if (!update) {
                return void 0;
            }

            return Promise
                .all([
                    log_query(
                        knex('packs')
                            .where('insert_id', update.insert_id)
                            .del()
                    ),
                    log_query(
                        knex('pack_links')
                            .where('insert_id', update.insert_id)
                            .del()
                    ),
                    log_query(
                        knex('words')
                            .where('insert_id', update.insert_id)
                            .del()
                    )
                ]);
        });
};
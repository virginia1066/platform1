import { knex } from '../../constants';
import { LessonUpdate } from '../../types/Wokobular';
import { head } from 'ramda';

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
                    knex('packs')
                        .delete()
                        .where('insert_id', update.lesson_id),
                    knex('pack_links')
                        .delete()
                        .where('insert_id', update.lesson_id),
                    knex('words')
                        .delete()
                        .where('insert_id', update.lesson_id)
                ]);
        });
};
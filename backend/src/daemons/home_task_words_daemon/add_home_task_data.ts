import { get_or_create_pack } from '../google_words_daemon/get_or_create_pack';
import { knex, WORD_CONFLICT_COLUMNS } from '../../constants';
import { PackLink, Word } from '../../types/Wokobular';
import { always } from 'ramda';
import { t } from 'i18next';

export const add_home_task_data = ({ words, visitors, insert_id, lesson_id }: AddHomeTaskProps): Promise<unknown> =>
    !words.length || !visitors.length
        ? Promise.resolve()
        : Promise
            .all([
                Promise
                    .all(visitors.map(({ userId }) =>
                        get_or_create_pack({
                            name: t('server.home_task_pack'),
                            parent_user_id: userId,
                            user_can_edit: false,
                            insert_id
                        }))
                    ),
                knex('words')
                    .insert(words)
                    .onConflict(WORD_CONFLICT_COLUMNS)
                    .merge()
                    .returning('*'),

            ])
            .then(([packs, words]) => {
                const links = packs.map((pack) =>
                    words.reduce<Array<PackLink>>((acc, word) => {
                        acc.push({
                            pack_id: pack.id,
                            word_id: word.id,
                            insert_id
                        });
                        return acc;
                    }, [])
                );

                return knex('pack_links')
                    .insert(links)
                    .onConflict()
                    .ignore();
            })
            .then(() =>
                knex('lesson_updates')
                    .insert({
                        insert_id,
                        lesson_id,
                        timestamp: new Date().toISOString()
                    })
                    .then(always(void 0)));

export type AddHomeTaskProps = {
    insert_id: string;
    lesson_id: number;
    visitors: Array<{ userId: number }>;
    words: Array<Omit<Word, 'id'>>;
}
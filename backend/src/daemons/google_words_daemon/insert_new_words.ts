import { knex, WORD_CONFLICT_COLUMNS } from '../../constants';
import { always } from 'ramda';
import { Pack, Word } from '../../types/Wokobular';

export const insert_new_words = (new_words: Array<Omit<Word, 'id' | 'insert_id'>>, pack: Pack, insert_id: string) =>
    knex('words')
        .insert(new_words)
        .onConflict(WORD_CONFLICT_COLUMNS)
        .merge()
        .returning('*')
        .then((added_words) =>
            knex('pack_links')
                .insert(added_words.map((word) => ({
                    pack_id: pack.id,
                    word_id: word.id,
                    insert_id
                })))
                .onConflict(['pack_id', 'word_id'])
                .ignore()
                .returning('*')
                .then(always(void 0))
        )
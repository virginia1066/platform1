import { knex } from '../constants';
import { Word, WordStatus } from '../types/Wokobular';
import { to_array } from './to_array';

export const get_words_by_pack = (pack_id: number, status_or_list: WordStatus | Array<WordStatus> = WordStatus.Active): Promise<Array<Word>> =>
    knex('pack_links')
        .where('pack_id', pack_id)
        .innerJoin('words', function () {
            this.on('words.id', 'pack_links.word_id')
                .andOn(knex.raw(`words.status IN (${to_array(status_or_list).map(() => '?').join(', ')})`, status_or_list));
        })
        .select<Array<Word>>(
            'word_id AS id',
            'ru',
            'en',
            'status',
            'source',
            'words.insert_id'
        );
import { Word } from '../../../types/Wokobular';
import { indexBy, prop } from 'ramda';

export const get_words_to_delete = (saved: Array<Word>, new_list: Array<Omit<Word, 'id' | 'insert_id'>>) => {
    const new_words_hash = indexBy(prop('en'), new_list);

    return saved.filter((word) => !new_words_hash[word.en]);
}
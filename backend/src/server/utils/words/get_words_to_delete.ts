import { Word } from '../../../types/Wokobular';
import { equals, indexBy, omit, prop } from 'ramda';

export const get_words_to_delete = (saved: Array<Word>, new_list: Array<Omit<Word, 'id' | 'insert_id'>>) => {
    const new_words_hash = indexBy(prop('en'), new_list);

    return saved.filter((word) => {
        const duplicate = new_words_hash[word.en];

        if (!duplicate) {
            return true;
        }

        return !equals(duplicate, omit(['insert_id', 'id'], word));
    });
};
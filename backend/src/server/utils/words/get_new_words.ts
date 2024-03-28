import { Word } from '../../../types/Wokobular';
import { equals, indexBy, omit, prop } from 'ramda';

export const get_new_words = (saved: Array<Word>, to_add: Array<AddWord>) => {
    const saved_words_hash = indexBy(prop('en'), saved);

    return to_add.filter((word) => {
        const duplicate = saved_words_hash[word.en];

        if (!duplicate) {
            return true;
        }

        const is_new = !equals(word, omit(['id', 'insert_id'], duplicate));
        if (is_new) {
            console.table([word, omit(['id', 'insert_id'], duplicate)]);
            debugger;
        }
        return is_new;
    });
};

type AddWord = Omit<Word, 'id' | 'insert_id'>;

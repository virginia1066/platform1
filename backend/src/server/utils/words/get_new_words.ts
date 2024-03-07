import { Word } from '../../../types/Wokobular';
import { equals, groupBy, omit, prop, propEq } from 'ramda';

export const get_new_words = (saved: Array<Word>, to_add: Array<Omit<Word, 'id' | 'insert_id'>>) => {
    const saved_words_hash = groupBy(prop('ru'), saved);

    return to_add.filter((word) => {
        const saved = saved_words_hash[word.ru];
        if (!saved) {
            return true;
        }
        const duplicate = saved.find(propEq(word.en, 'en'));

        if (!duplicate) {
            return true;
        }

        return !equals(word, omit(['id', 'insert_id'], duplicate));
    });
};
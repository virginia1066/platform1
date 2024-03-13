import { Word } from '../../../types/Wokobular';
import { equals, findLastIndex, groupBy, indexBy, omit, prop, propEq } from 'ramda';

const unite_duplicates = (to_add: Array<AddWord>): Array<AddWord> => {
    const result = to_add.slice();
    const hash = groupBy(prop('en'), to_add);
    Object.keys(hash).forEach((en) => {
        const loop = () => {
            if (hash[en]!.length === 1) {
                return void 0;
            }
            const last_index = findLastIndex(propEq(en, 'en'), result);
            const ru = result[last_index].ru;
            result.splice(last_index, 1);
            const new_index = findLastIndex(propEq(en, 'en'), result);
            result[new_index] = {
                ...result[new_index],
                ru: `${result[new_index].ru}, ${ru}`
            };
            hash[en]!.pop();
            loop();
        };
        loop();
    });
    return result;
};

export const get_new_words = (saved: Array<Word>, to_add: Array<AddWord>) => {
    const saved_words_hash = indexBy(prop('en'), saved);
    const united = unite_duplicates(to_add);

    return united.filter((word) => {
        const duplicate = saved_words_hash[word.en];

        if (!duplicate) {
            return true;
        }

        return !equals(word, omit(['id', 'insert_id'], duplicate));
    });
};

type AddWord = Omit<Word, 'id' | 'insert_id'>;

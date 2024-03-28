import { findLastIndex, groupBy, prop, propEq } from 'ramda';
import { Word } from '../../../types/Wokobular';

export const unite_duplicates = (to_add: Array<AddWord>): Array<AddWord> => {
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

type AddWord = Omit<Word, 'id' | 'insert_id'>;

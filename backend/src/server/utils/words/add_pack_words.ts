import { Pack, Word, WordStatus } from '../../../types/Wokobular';
import { get_words_by_pack } from '../../../utils/get_words_by_pack';
import { get_new_words } from './get_new_words';
import { assoc } from 'ramda';
import { insert_new_words } from './insert_new_words';
import { info } from '../../../utils/log';

export const add_pack_words = (pack: Pack, add_words: Array<Omit<Word, 'id' | 'insert_id'>>, insert_id: string): Promise<void> =>
    get_words_by_pack(pack.id, [WordStatus.Active, WordStatus.Deleted])
        .then((words) => {
            const new_words = get_new_words(words, add_words)
                .map<Omit<Word, 'id'>>(assoc('insert_id', insert_id));

            if (!new_words.length) {
                info(`Has no new words in pack ${pack.id} ${pack.name}`);
                return void 0;
            }

            info(`New words (${new_words.length}):`, new_words);

            return insert_new_words(new_words, pack, insert_id);
        });
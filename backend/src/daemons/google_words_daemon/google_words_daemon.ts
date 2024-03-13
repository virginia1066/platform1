import { interval } from '../../utils/interval';
import { make_time } from '../../utils/cache';
import { get_google_wokobular } from '../../utils/get_google_wokobular';
import { Word, WordStatus } from '../../types/Wokobular';
import { MAX_PACK_NAME_LENGTH, SYSTEM_PACK_ID } from '../../constants';
import { assoc, pipe } from 'ramda';
import * as console from '../../utils/log';
import { get_or_create_pack } from '../../utils/get_or_create_pack';
import { get_words_by_pack } from '../../utils/get_words_by_pack';
import { randomUUID } from 'crypto';
import { get_new_words } from '../../server/utils/words/get_new_words';
import { insert_new_words } from '../../server/utils/words/insert_new_words';
import { add_pack_words } from '../../server/utils/words/add_pack_words';

const info = console.info.bind(null, 'Google words daemon:');
const warn = console.warn.bind(null, 'Google words daemon:');
const error = console.error.bind(null, 'Google words daemon:');

const add_pack = (name: string, google_words: Array<Omit<Word, 'id' | 'insert_id'>>, insert_id: string): Promise<void> =>
    get_or_create_pack({
        name,
        parent_user_id: SYSTEM_PACK_ID,
        user_can_edit: false,
        insert_id
    }).then((pack) => add_pack_words(pack, google_words, insert_id));

export const google_words_daemon = () => {
    info(`Launch google words daemon!`);
    interval(() => {
        info(`Launch interval.`);
        return get_google_wokobular()
            .then((hash) => {
                return new Promise<void>((resolve, reject) => {
                    const packs_with_links = Object.entries(hash).map(([pack_name, words]) => ({
                        pack_name, words
                    }));

                    const iterator = packs_with_links[Symbol.iterator]();
                    const insert_id = randomUUID();

                    const loop = (iterator: Iterator<IteratorBody>): void | Promise<void> => {
                        const { done, value } = iterator.next();

                        if (!value || done) {
                            info(`All google list done. Wait next loop.`);
                            resolve();
                            return void 0;
                        }

                        const get_result_promise = () => {
                            if (value.pack_name.length > MAX_PACK_NAME_LENGTH) {
                                warn(`Wrong pack name from google sheets!`, value.pack_name);
                                return Promise.resolve(void 0);
                            }
                            return add_pack(value.pack_name, value.words, insert_id);
                        };

                        return get_result_promise()
                            .then(() => loop(iterator))
                            .catch(pipe(error, reject));
                    };

                    loop(iterator);
                });
            });
    }, make_time(15, 'minutes'));
};

type IteratorBody = {
    pack_name: string;
    words: Array<Omit<Word, 'id' | 'insert_id'>>;
}
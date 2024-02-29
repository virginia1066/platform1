import { interval } from '../../utils/interval';
import { make_time } from '../../utils/cache';
import { get_google_wokobular } from '../../utils/get_google_wokobular';
import { Word, WordStatus } from '../../types/Wokobular';
import { knex, SYSTEM_PACK_ID, WORD_CONFLICT_COLUMNS } from '../../constants';
import { always, assoc, equals, groupBy, omit, pipe, prop, propEq } from 'ramda';
import { error, info as log_info } from '../../utils/log';
import { get_or_create_pack } from './get_or_create_pack';
import { get_words_by_pack } from '../../utils/get_words_by_pack';
import { randomUUID } from 'crypto';

const info = log_info.bind(null, 'Google words daemon:');

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

                    const loop = (iterator: Iterator<{ pack_name: string, words: Array<Omit<Word, 'id' | 'insert_id'>> }>) => {
                        const { done, value } = iterator.next();

                        if (!value || done) {
                            info(`All google list done. Wait next loop.`);
                            resolve();
                            return void 0;
                        }

                        get_or_create_pack({
                            name: value.pack_name,
                            parent_user_id: SYSTEM_PACK_ID,
                            user_can_edit: false,
                            insert_id
                        })
                            .then((pack) =>
                                get_words_by_pack(pack.id, [WordStatus.Active, WordStatus.Deleted])
                                    .then((words) => {
                                        const saved_words_hash = groupBy(prop('ru'), words);

                                        const new_words = value.words.filter((word) => {
                                            const saved = saved_words_hash[word.ru];
                                            if (!saved) {
                                                return true;
                                            }
                                            const duplicate = saved.find(propEq(word.en, 'en'));

                                            if (!duplicate) {
                                                return true;
                                            }

                                            return !equals(word, omit(['id', 'insert_id'], duplicate))
                                        }).map<Omit<Word, 'id'>>(assoc('insert_id', insert_id));

                                        if (!new_words.length) {
                                            info(`Has no new words in pack ${pack.id} ${pack.name}`);
                                            return void 0;
                                        }

                                        info(`New words (${new_words.length}):`, new_words);

                                        return knex('words')
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
                                            );
                                    })
                            )
                            .then(() => {
                                loop(iterator);
                            })
                            .catch(pipe(error, reject));
                    };

                    loop(iterator);
                });
            });
    }, make_time(15, 'minutes'));
};
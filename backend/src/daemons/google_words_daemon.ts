import { interval } from '../utils/interval';
import { make_time } from '../utils/cache';
import { get_google_wokobular } from '../utils/get_google_wokobular';
import { Pack, WokobularStatus, Word } from '../types/Wokobular';
import { knex } from '../constants';
import { always, head, pipe } from 'ramda';
import { error, info as log_info } from '../utils/log';

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

                    const loop = (iterator: Iterator<{ pack_name: string, words: Array<Omit<Word, 'id'>> }>) => {
                        const { done, value } = iterator.next();

                        if (!value || done) {
                            resolve();
                            return void 0;
                        }

                        knex('packs')
                            .select('*')
                            .where({
                                name: value.pack_name,
                                parent_user_id: 0
                            })
                            .then<Pack | undefined>(head)
                            .then((pack) => {
                                if (!pack) {
                                    info(`Has no system pack! Create new pack with name ${value.pack_name}!`);
                                    return knex('packs')
                                        .insert({
                                            name: value.pack_name,
                                            parent_user_id: 0,
                                            status: WokobularStatus.Active
                                        })
                                        .returning('*')
                                        .then<Pack>(head);
                                } else {
                                    info(`Modify pack ${value.pack_name}`);
                                }
                                return pack;
                            })
                            .then((pack) =>
                                knex('words')
                                    .insert(value.words)
                                    .onConflict(['ru', 'en'])
                                    .merge()
                                    .returning('*')
                                    .then((added_words) =>
                                        knex('pack_links')
                                            .insert(added_words.map((word) => ({
                                                pack_id: pack.id,
                                                word_id: word.id
                                            })))
                                            .onConflict(['pack_id', 'word_id'])
                                            .ignore()
                                            .returning('*')
                                            .then(always(void 0))
                                    )
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
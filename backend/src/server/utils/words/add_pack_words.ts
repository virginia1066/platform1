import { Pack, Word, WordStatus } from '../../../types/Wokobular';
import { get_words_by_pack } from '../../../utils/get_words_by_pack';
import { get_new_words } from './get_new_words';
import { always, assoc, isNil, not, omit, pipe, prop } from 'ramda';
import { insert_new_words } from './insert_new_words';
import { info } from '../../../utils/log';
import { Optional } from '../../../types/utils';
import { knex } from '../../../constants';
import { get_words_to_delete } from './get_words_to_delete';

const add_words = (words: Array<Omit<Word, 'id'>>, pack: Pack, insert_id: string) => {
    if (!words.length) {
        info(`Has no new words in pack ${pack.id} ${pack.name}`);
        return Promise.resolve(void 0);
    }

    info(`New words (${words.length}):`, words);

    return insert_new_words(words, pack, insert_id);
};

const update_words = (words: Array<EditWord>) => {
    if (!words.length) {
        return Promise.resolve(void 0);
    }
    info(`Update words (${words.length}):`, words);

    return knex
        .transaction((trx) => {
            const promises = words
                .map((word) => trx('words')
                    .update(omit(['id'], word))
                    .where('id', word.id));

            return Promise.all(promises)
                .then(trx.commit)
                .catch(trx.rollback);
        });
};

const delete_words = (words: Array<Word>) => {
    if (!words.length) {
        return Promise.resolve();
    }
    const id_list = words.map(prop('id'));
    info(`Delete words (${words.length}):`, words)

    return knex
        .transaction((trx) =>
            Promise
                .all([
                    trx('words')
                        .del()
                        .where('id', 'in', id_list),
                    trx('pack_links')
                        .del()
                        .where('word_id', 'in', id_list),
                    trx('learn_cards')
                        .del()
                        .where('word_id', 'in', id_list)
                ])
                .then(trx.commit)
                .catch(trx.rollback)
        );
};


export const add_pack_words = (pack: Pack, words_to_update: Array<NewWord>, insert_id: string): Promise<void> =>
    get_words_by_pack(pack.id, [WordStatus.Active, WordStatus.Deleted])
        .then((words) => {

            const with_id: Array<EditWord> = words_to_update
                .filter(pipe(prop('id'), isNil, not) as IsCallback<NewWord, EditWord>);

            const without_id: Array<CreateWord> = words_to_update
                .filter(pipe(prop('id'), isNil) as IsCallback<NewWord, CreateWord>);

            const new_words = get_new_words(words, without_id)
                .map<Omit<Word, 'id'>>(assoc('insert_id', insert_id));

            const words_to_delete = get_words_to_delete(words, without_id);

            return Promise
                .all([
                    add_words(new_words, pack, insert_id),
                    update_words(with_id),
                    delete_words(words_to_delete)
                ])
                .then(always(void 0));
        });

type NewWord = Omit<Optional<Word, 'id'>, 'insert_id'>;
type EditWord = Omit<Word, 'insert_id'>;
type CreateWord = Omit<Word, 'insert_id' | 'id'>;
type IsCallback<T, R extends T> = (word: T) => word is R;
import { sample } from 'effector';
import {
    $errors,
    $id,
    $is_edit,
    $name,
    $words,
    add_word_e,
    change_name_e,
    create_deck_fx,
    CreateDeckProps,
    DeckEditG,
    delete_word_e,
    edit_word_e,
    EditWord,
    EMPTY_WORD,
    input_blur_e,
    input_focus_e,
    load_deck_fx,
    save_click_e,
    save_deck_fx,
    validate_fx,
    ValidateProps,
    WordStatus
} from './dictionary';
import { always, append, assoc, is, isNil, map, mergeRight, nthArg, omit, pipe, prop } from 'ramda';
import { Word } from '../../../types/vocabulary';
import { Func } from '../../../types/utils';
import { navigate_e } from '../../../models/core';
import { BASE_URL } from '../../../constants';

sample({
    clock: DeckEditG.open,
    filter: is(Number),
    target: load_deck_fx
});

$id
    .on(load_deck_fx.doneData, pipe(
        nthArg(1),
        prop('data'),
        prop('id')
    ))
    .reset(DeckEditG.close);

$name
    .on(load_deck_fx.doneData, pipe(
        nthArg(1),
        prop('data'),
        prop('name')
    ))
    .on(change_name_e, nthArg(1))
    .reset(DeckEditG.close);

$words
    .on(load_deck_fx.doneData, pipe(
        nthArg(1),
        prop('data'),
        prop('words'),
        map<Word, EditWord>(pipe<[Word], Omit<Word, 'due'>, EditWord>(
            omit(['due']),
            assoc('status', WordStatus.Active)
        ))
    ))
    .on(add_word_e, pipe(
        nthArg(0),
        append({ ...EMPTY_WORD })
    ))
    .on(edit_word_e, (words, { value, lang, index }) => {
        const clone = words.slice();
        clone[index] = {
            ...clone[index],
            [lang]: value
        };
        return clone;
    })
    .on(delete_word_e, (words, index) => {
        const word = words[index];
        if (isNil(word.id)) {
            const new_list = words.slice();
            new_list.splice(index, 1);
            return new_list;
        }
        word.status = WordStatus.Deleted;
        return words.slice();
    })
    .reset(DeckEditG.close);

$errors
    .on(validate_fx.fail, (errors, { error, params }) => {
        if (params.key) {
            return {
                ...errors,
                [params.key]: error[params.key]
            };
        } else {
            return error;
        }
    })
    .on(delete_word_e, (errors, index) => {
        const clone = { ...errors };
        delete clone[`words[${index}].ru`];
        delete clone[`words[${index}].en`];
        return clone;
    })
    .on(input_focus_e, (errors, path) => {
        const clone = { ...errors };
        delete clone[path];
        return clone;
    })
    .on([create_deck_fx.failData, save_deck_fx.failData], pipe(
        nthArg(1),
        prop('data'),
        prop('data')
    ))
    .reset(DeckEditG.close);

sample({
    clock: save_click_e,
    source: {
        name: $name,
        words: $words,
    },
    fn: mergeRight({
        key: undefined,
        from: 'button_click' as const
    }) as Func<[CreateDeckProps], ValidateProps>,
    target: validate_fx
});

sample({
    clock: input_blur_e,
    source: {
        name: $name,
        words: $words
    },
    fn: (source, key): ValidateProps => ({
        ...source,
        key,
        from: 'blur'
    }),
    target: validate_fx
});

sample({
    clock: validate_fx.done,
    source: {
        is_edit: $is_edit,
        name: $name,
        id: $id,
        words: $words
    },
    filter: (data, props) => {
        return data.is_edit && props.params.from === 'button_click';
    },
    target: save_deck_fx,
});

sample({
    clock: validate_fx.done,
    source: {
        is_edit: $is_edit,
        name: $name,
        words: $words
    },
    filter: (data, props) => {
        return !data.is_edit && props.params.from === 'button_click';
    },
    target: create_deck_fx,
});

sample({
    clock: [save_deck_fx.done, create_deck_fx.done],
    fn: always(`${BASE_URL}/`),
    target: navigate_e
});





import { sample } from 'effector';
import {
    $id,
    $is_edit,
    $name,
    $words,
    add_word_e,
    create_deck_fx,
    DeckEditG,
    edit_word_e,
    EditWord,
    EditWordEvent,
    load_deck_fx,
    save_click_e,
    save_deck_fx
} from './dictionary';
import { concat, converge, is, not, nthArg, pipe, prop, update } from 'ramda';
import { Func } from '../../../types/utils';

sample({
    clock: DeckEditG.open,
    filter: is(Number),
    target: load_deck_fx
});

sample({
    clock: save_click_e,
    source: {
        is_edit: $is_edit,
        name: $name,
        id: $id,
        words: $words
    },
    filter: pipe(prop('is_edit'), is(Number)),
    target: save_deck_fx,
});

sample({
    clock: save_click_e,
    source: {
        is_edit: $is_edit,
        name: $name,
        words: $words
    },
    filter: pipe(prop('is_edit'), is(Number), not),
    target: create_deck_fx,
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
    .reset(DeckEditG.close);

$words
    .on(load_deck_fx.doneData, pipe(
        nthArg(1),
        prop('data'),
        prop('words')
    ))
    .on(add_word_e, pipe(
        nthArg(0),
        concat([{ ru: '', en: '' }])
    ))
    .on(edit_word_e, converge(
        update, [
            pipe<[Array<EditWord>, EditWordEvent], EditWordEvent, number>(nthArg(1), prop('index')),
            pipe<[Array<EditWord>, EditWordEvent], EditWordEvent, EditWord>(nthArg(1), prop('word')),
            nthArg(0) as Func<[Array<EditWord>, EditWordEvent], Array<EditWord>>
        ])
    )
    .reset(DeckEditG.close);





import { sample } from 'effector';
import {
    $id,
    $is_edit,
    $name,
    $words,
    add_word_e,
    create_deck_fx,
    DeckEditG, edit_word_e,
    load_deck_fx,
    save_click_e,
    save_deck_fx
} from './dictionary';
import { concat, not, nthArg, pipe, prop } from 'ramda';

const is_edit = (data: number | 'new'): data is number =>
    typeof data === 'number';

sample({
    clock: DeckEditG.open,
    filter: is_edit,
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
    filter: pipe(prop('is_edit'), is_edit),
    target: save_deck_fx,
});

sample({
    clock: save_click_e,
    source: {
        is_edit: $is_edit,
        name: $name,
        words: $words
    },
    filter: pipe(prop('is_edit'), is_edit, not),
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
    .on(edit_word_e, (list, { word, index }) => {
        const copy = list.slice();
        copy[index] = word;
        return copy;
    })
    .reset(DeckEditG.close);



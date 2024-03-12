import { sample } from 'effector';
import {
    $deckList,
    $delete_list,
    $editMode,
    $skipDeckList,
    $tmpDeckList,
    cancelEditModeE,
    changeSkipList,
    DeckListGate,
    delete_decks_fx,
    deleteDeckE,
    enableEditModeE,
    fetchDeckListFx,
    saveSkipListE
} from './dictionary';
import { __, always, append, equals, flip, gte, length, not, nthArg, pipe, prop, uniq } from 'ramda';
import { Func } from '../../../types/utils';

sample({
    clock: DeckListGate.open,
    target: fetchDeckListFx
});

$editMode
    .on(enableEditModeE, always(true))
    .on(cancelEditModeE, always(false))
    .reset(DeckListGate.close);

$deckList
    .on(fetchDeckListFx.doneData, pipe(
        nthArg(1),
        prop('data')
    ))
    .reset(DeckListGate.close);

$delete_list
    .on(deleteDeckE, pipe<[Array<number>, number], Array<number>, Array<number>>(
        flip(append) as Func<[Array<number>, number], Array<number>>,
        uniq
    ))
    .reset(DeckListGate.close, cancelEditModeE);

$tmpDeckList
    .on(changeSkipList, (current_list, { id, checked }) => {
        if (checked) {
            return current_list.filter(pipe(equals(id), not));
        } else {
            return [id, ...current_list];
        }
    })
    .reset(cancelEditModeE);

sample({
    clock: enableEditModeE,
    source: $skipDeckList,
    fn: (list) => list.slice(),
    target: $tmpDeckList
});

sample({
    clock: saveSkipListE,
    source: $tmpDeckList,
    target: $skipDeckList,
});

sample({
    clock: saveSkipListE,
    source: $delete_list,
    filter: pipe(length, gte(__, 1)),
    target: delete_decks_fx
});

sample({
    clock: saveSkipListE,
    source: $delete_list,
    filter: pipe(length, equals(0)),
    target: cancelEditModeE
});

sample({
    clock: delete_decks_fx.done,
    target: cancelEditModeE
});

sample({
    clock: delete_decks_fx.done,
    filter: pipe<[{ params: number[] }], Array<number>, number, boolean>(
        prop('params'),
        length,
        gte(__, 1)
    ),
    target: fetchDeckListFx
});

import { sample } from 'effector';
import {
    $deckList,
    $editMode,
    $skipDeckList,
    $tmpDeckList,
    cancelEditModeE,
    changeSkipList,
    DeckListGate,
    delete_deck_fx,
    enableEditModeE,
    fetchDeckListFx,
    saveSkipListE
} from './dictionary';
import { always, equals, not, nthArg, pipe, prop } from 'ramda';

sample({
    clock: DeckListGate.open,
    target: fetchDeckListFx
});

$editMode
    .on(enableEditModeE, always(true))
    .on(cancelEditModeE, always(false))
    .reset(DeckListGate.close);

$deckList
    .on([fetchDeckListFx.doneData, delete_deck_fx.doneData], pipe(
        nthArg(1),
        prop('data')
    ))
    .reset(DeckListGate.close);

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
    target: cancelEditModeE
});

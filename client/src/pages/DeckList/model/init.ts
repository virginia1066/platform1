import { sample } from 'effector';
import {
    $deckList,
    $editMode,
    $skipDeckList,
    $tmpDeckList,
    cancelEditModeE,
    changeSkipList,
    DeckListGate,
    enableEditModeE,
    fetchDeckListFx,
    saveSkipListE
} from './dictionary';
import { always, equals, not, nthArg, pipe } from 'ramda';

sample({
    clock: DeckListGate.open,
    target: fetchDeckListFx
});

$editMode
    .on(enableEditModeE, always(true))
    .on(cancelEditModeE, always(false))
    .reset(DeckListGate.close);

$deckList
    .on(fetchDeckListFx.doneData, nthArg(1))
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

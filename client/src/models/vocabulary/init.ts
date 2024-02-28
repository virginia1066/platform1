import { sample } from 'effector';
import { $deckList, $editMode, DeckListGate, fetchDeckFx, setEditModeE } from './dictionary';
import { nthArg } from 'ramda';

sample({
    clock: DeckListGate.open,
    target: fetchDeckFx
});

$editMode
    .on(setEditModeE, nthArg(1))
    .reset(DeckListGate.close);

$deckList
    .on(fetchDeckFx.doneData, nthArg(1))
    .reset(DeckListGate.close);
import { sample } from 'effector';
import { $deckList, DeckListGate, fetchDeckFx } from './dictionary';
import { nthArg } from 'ramda';

sample({
    clock: DeckListGate.open,
    target: fetchDeckFx
});

$deckList
    .on(fetchDeckFx.doneData, nthArg(1))
    .reset(DeckListGate.close);
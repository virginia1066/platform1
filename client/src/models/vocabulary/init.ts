import { sample } from 'effector';
import { DeckListGate, fetchDeckFx } from './dictionary';

sample({
    clock: DeckListGate.open,
    target: fetchDeckFx
});
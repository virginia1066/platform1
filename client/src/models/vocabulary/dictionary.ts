import { createGate } from 'effector-react';
import { coreD } from '../core';

export const DeckListGate = createGate({
    domain: coreD
});

export const $deckList = coreD.createStore<Array<DeckItem>>([]);

export const fetchDeckFx = coreD.createEffect(() => {
    Telegram.WebApp.initDataUnsafe.auth_date
    return fetch('/api/v1/user/')
});

type DeckItem = {
    id: number;
    name: string;
    count_new: number;
    count_learning: number;
    count_review: number;
    count_relearning: number;
}

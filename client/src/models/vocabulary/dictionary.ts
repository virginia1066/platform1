import { createGate } from 'effector-react';
import { coreD } from '../core';
import { request } from '../../utils/request';
import { prop } from 'ramda';

export const DeckListGate = createGate({
    domain: coreD
});

export const $deckList = coreD.createStore<Array<DeckItem>>([]);

export const fetchDeckFx = coreD.createEffect(() =>
    request<Array<DeckItem>>('/api/v1/web-app/user/packs')
        .then(prop('data'))
);

export type DeckItem = {
    id: number;
    name: string;
    count_new: number;
    count_learning: number;
    count_review: number;
    count_relearning: number;
    words_count: number;
};

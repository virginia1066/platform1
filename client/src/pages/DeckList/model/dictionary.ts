import { createGate } from 'effector-react';
import { coreD } from '../../../models/core';
import { request } from '../../../utils/request';
import { assoc, prop } from 'ramda';
import { combine, Store } from 'effector';
import { DeckItemShort } from '../../../types/vocabulary';

export const DeckListGate = createGate({
    domain: coreD
});

export const $editMode = coreD.createStore(false);

export const $deckList = coreD.createStore<Array<DeckItemShort>>([]);

export const $deckListC = combine($deckList, $editMode, (list, mode) => {
    return list.map<DeckItemShort & { editMode: boolean }>(assoc('editMode', mode));
});

export const setEditModeE = coreD.createEvent<boolean>();

export const fetchDeckFx = coreD.createEffect(() =>
    request<Array<DeckItemShort>>('/api/v1/web-app/user/packs')
        .then(prop('data'))
);



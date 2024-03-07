import { createGate } from 'effector-react';
import { coreD } from '../../../models/core';
import { request } from '../../../utils/request';
import { __, always, assoc, includes, not, pipe, prop } from 'ramda';
import { combine } from 'effector';
import { DeckItemShort } from '../../../types/vocabulary';
import { persist } from 'effector-storage/local';
import { make_request_fx } from '../../../utils/make_request_fx';

export const DeckListGate = createGate({
    domain: coreD
});

export const $skipDeckList = coreD.createStore<Array<number>>([]);
export const $tmpDeckList = coreD.createStore<Array<number>>([]);

persist({
    store: $skipDeckList,
    key: 'skip-deck-list',
    deserialize: (deckListStr: string | null) => {
        if (!deckListStr) {
            return [];
        } else {
            try {
                return JSON.parse(deckListStr);
            } catch (e) {
                return [];
            }
        }
    }
});

export const $editMode = coreD.createStore(false);

export const $deckList = coreD.createStore<Array<DeckItemShort>>([]);

export const $deckListC = combine(
    $deckList,
    $editMode,
    $skipDeckList,
    (list, editMode, slipList) =>
        list
            .map<DeckItemShort & { editMode: boolean }>(assoc('editMode', editMode))
            .filter(editMode ? always(true) : pipe(prop('id'), includes(__, slipList), not))
);

export const changeSkipList = coreD.createEvent<ChangeSkipProps>();
export const enableEditModeE = coreD.createEvent();
export const cancelEditModeE = coreD.createEvent();
export const saveSkipListE = coreD.createEvent();

export const fetchDeckListFx = coreD.createEffect(() =>
    request<Array<DeckItemShort>>('/api/v1/web-app/user/packs')
);

export const delete_deck_fx = make_request_fx<number, Array<DeckItemShort>>({
    url: (id: number) => `/api/v1/web-app/user/packs/${id}`,
    init: {
        method: 'DELETE'
    }
});

export type ChangeSkipProps = {
    id: number;
    checked: boolean;
}



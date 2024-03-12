import { createGate } from 'effector-react';
import { coreD } from '../../../models/core';
import { request } from '../../../utils/request';
import { __, always, assoc, concat, includes, not, pipe, prop } from 'ramda';
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

export const $delete_list = coreD.createStore<Array<number>>([]);

export const $editMode = coreD.createStore(false);

export const $deckList = coreD.createStore<Array<DeckItemShort>>([]);

export const $deckListC = combine(
    $deckList,
    $editMode,
    $skipDeckList,
    $delete_list,
    (list, editMode, hideList, deleteList) =>
        list
            .map<DeckItemShort & { editMode: boolean }>(assoc('editMode', editMode))
            .filter(editMode
                ? pipe(prop('id'), includes(__, deleteList), not)
                : pipe(prop('id'), includes(__, hideList), not)
            )
);

export const changeSkipList = coreD.createEvent<ChangeSkipProps>();
export const enableEditModeE = coreD.createEvent();
export const cancelEditModeE = coreD.createEvent();
export const saveSkipListE = coreD.createEvent();
export const deleteDeckE = coreD.createEvent<number>();

export const fetchDeckListFx = coreD.createEffect(() =>
    request<Array<DeckItemShort>>('/api/v1/web-app/user/packs')
);

export const delete_decks_fx = coreD.createEffect(
    (delete_list: Array<number>) =>
        Promise.all(delete_list.map((id) => request(`/api/v1/web-app/user/packs/${id}`, {
            method: 'DELETE'
        })))
);

export type ChangeSkipProps = {
    id: number;
    checked: boolean;
}



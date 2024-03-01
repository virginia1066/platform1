import { createGate } from 'effector-react';
import { coreD } from '../../../models/core';
import { request } from '../../../utils/request';
import { equals, not, omit, pipe } from 'ramda';
import { combine, Store } from 'effector';
import { DeckItemDetailed, Word } from '../../../types/vocabulary';
import { Optional } from '../../../types/utils';

export const DeckEditG = createGate<number | 'new'>({
    domain: coreD,
    defaultState: 'new'
});

export const $is_edit: Store<boolean> = combine(DeckEditG.state, pipe<[number | 'new'], boolean, boolean>(
    equals('new' as (number | 'new')),
    not
));

export const $name = coreD.createStore('');
export const $id = coreD.createStore(0);
export const $words = coreD.createStore<Array<Omit<Word, 'id'>>>([]);
export const add_word_e = coreD.createEvent();
export const edit_word_e = coreD.createEvent<EditWordEvent>();
export const save_click_e = coreD.createEvent();

export const load_deck_fx = coreD.createEffect((id: number) =>
    request<DeckItemDetailed>(`/api/v1/web-app/user/packs/${id}`));

export const create_deck_fx = coreD.createEffect((props: CreateDeckProps) =>
    request(`/api/v1/web-app/user/packs`, {
        method: 'POST',
        body: JSON.stringify(props)
    })
);

export const save_deck_fx = coreD.createEffect((props: SaveDeckProps) =>
    request(`/api/v1/web-app/user/packs/${props.id}`, {
        method: 'POST',
        body: JSON.stringify(omit(['id'], props))
    })
);

export type CreateDeckProps = {
    name: string;
    words: Array<Optional<Word, 'id'>>;
}

export type SaveDeckProps = CreateDeckProps & {
    id: number;
}

export type EditWordEvent = {
    word: Optional<Word, 'id'>;
    index: number;
}

import { createGate } from 'effector-react';
import { coreD } from '../../../models/core';
import { request } from '../../../utils/request';
import { always, equals, filter, ifElse, isNil, not, omit, pipe, prop, propEq } from 'ramda';
import { combine, Store } from 'effector';
import { DeckItemDetailed, Word } from '../../../types/vocabulary';
import { Optional } from '../../../types/utils';
import { array, object, string } from 'yup';
import { MAX_PACK_NAME_LENGTH, MAX_WORD_LENGTH } from '../../../constants';
import { make_validate_fx } from '../../../utils/make_validate_fx';
import { getFixedT } from 'i18next';
import { make_request_fx } from '../../../utils/make_request_fx';

export enum WordStatus {
    Active = 'ACTIVE',
    Deleted = 'DELETED'
}

export const EMPTY_WORD: EditWord = {
    en: '',
    ru: '',
    status: WordStatus.Active
};

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
export const $words = coreD.createStore<Array<EditWord>>([{ ...EMPTY_WORD }]);
export const add_word_e = coreD.createEvent();
export const edit_word_e = coreD.createEvent<EditWordEvent>();
export const save_click_e = coreD.createEvent();
export const delete_word_e = coreD.createEvent<number>();
export const change_name_e = coreD.createEvent<string>();
export const input_focus_e = coreD.createEvent<string>();
export const input_blur_e = coreD.createEvent<string>();
export const $errors = coreD.createStore<Record<string, string>>(Object.create(null));
const t = getFixedT('translation', undefined, 'vocabulary.deckEdit');

export const $view_words = combine($words, filter(
    ifElse(
        pipe<[EditWord], number | undefined, boolean>(prop('id'), isNil),
        always(true),
        propEq(WordStatus.Active, 'status')
    ))
);

export const validate_fx = make_validate_fx<ValidateProps>(object().shape({
    name: string().required(t('required')).max(MAX_PACK_NAME_LENGTH, t('max')),
    words: array().required().min(1).of(object().shape({
        ru: string().required(t('required')).max(MAX_WORD_LENGTH, t('max')),
        en: string().required(t('required')).max(MAX_WORD_LENGTH, t('max')),
        status: string().required().oneOf([
            WordStatus.Active,
            WordStatus.Deleted
        ])
    }))
}));

export const load_deck_fx = make_request_fx<number, DeckItemDetailed>({
    url: (id: number) => `/api/v1/web-app/user/packs/${id}`
});

export const create_deck_fx = make_request_fx<CreateDeckProps, any, ErrorType>({
    url: '/api/v1/web-app/user/packs/new',
    init: (deck) => ({
        method: 'PUT',
        body: JSON.stringify(deck)
    })
});

type ErrorType = {
    data: Record<string, string>;
    details: string;
    message: string;
    type: string;
}

export const save_deck_fx = coreD.createEffect((props: SaveDeckProps) =>
    request(`/api/v1/web-app/user/packs/${props.id}`, {
        method: 'PATCH',
        body: JSON.stringify(omit(['id'], props))
    })
);

export type CreateDeckProps = {
    name: string;
    words: Array<EditWord>;
}

export type ValidateProps = CreateDeckProps & {
    key?: string;
    from: 'blur' | 'button_click';
}

export type SaveDeckProps = CreateDeckProps & {
    id: number;
}

export type EditWordEvent = {
    lang: 'ru' | 'en';
    value: string;
    index: number;
}

export type EditWord = Optional<Omit<Word, 'due'>, 'id'> & {
    status: WordStatus
};

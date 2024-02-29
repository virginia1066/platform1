import { coreD } from '../../../models/core';
import { createGate } from 'effector-react';
import { request } from '../../../utils/request';
import { DeckItemDetailed, DeckStats, Word } from '../../../types/vocabulary';
import { combine, Store } from 'effector';
import { defaultTo, nth, pipe } from 'ramda';

export const DeckG = createGate<number>({
    domain: coreD,
    defaultState: 0
});

export const $pack_name = coreD.createStore('');
export const $pack_id = coreD.createStore(0);
export const $count_new = coreD.createStore(0);
export const $count_learning = coreD.createStore(0);
export const $count_review = coreD.createStore(0);
export const $active_word_index = coreD.createStore(0);
export const $word_list = coreD.createStore<Array<Word>>([]);
export const $translate_shown = coreD.createStore(false);
export const $active_word: Store<Word> = combine<Store<number>, Store<Array<Word>>, Word>(
    $active_word_index,
    $word_list,
    pipe<[number, Array<Word>], Word | undefined, Word>(nth, defaultTo<Word>({ ru: '', en: '', id: 0 }))
);

export const $is_finish = combine($active_word_index, $word_list, (index, words) =>
    words.length && index >= words.length
);

export const set_again = coreD.createEvent();
export const set_hard = coreD.createEvent();
export const set_good = coreD.createEvent();
export const set_easy = coreD.createEvent();
export const show_translate = coreD.createEvent();

export const get_pack_fx = coreD.createEffect((id: number) =>
    request<DeckItemDetailed>(`/api/v1/web-app/user/packs/${id}`));

export const send_progress_fx = coreD.createEffect(
    (props: SendProgressProps) =>
        request<Omit<DeckStats, 'count_can_be_shown'>>('/api/v1/web-app/user/word-update', {
            method: 'PATCH',
            body: JSON.stringify(props)
        }));

export type SendProgressProps = {
    word_id: number;
    pack_id: number;
    student_choice: number;
}
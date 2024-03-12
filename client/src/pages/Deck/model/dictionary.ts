import { coreD } from '../../../models/core';
import { createGate } from 'effector-react';
import { request } from '../../../utils/request';
import { DeckItemDetailed, DeckStats, Word } from '../../../types/vocabulary';
import { combine } from 'effector';
import { WordCollection } from '../WordCollection';

export const DeckG = createGate<number>({
    domain: coreD,
    defaultState: 0
});

export const $pack_name = coreD.createStore('');
export const $pack_id = coreD.createStore(0);
export const $count_new = coreD.createStore(0);
export const $count_learning = coreD.createStore(0);
export const $count_review = coreD.createStore(0);
export const $words_collection = coreD.createStore<null | WordCollection>(null);
export const $translate_shown = coreD.createStore(false);

export const $is_finish = combine($words_collection, (words) =>
    words && !words.active_word
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
        request<SendProgressResponse>('/api/v1/web-app/user/word-update', {
            method: 'PATCH',
            body: JSON.stringify(props)
        }));

export type SendProgressProps = {
    word_id: number;
    pack_id: number;
    student_choice: number;
}

type SendProgressResponse = {
    stats: DeckStats;
    word: Word<string>;
};
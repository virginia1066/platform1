import { sample } from 'effector';
import {
    $active_word,
    $active_word_index,
    $count_learning,
    $count_new,
    $count_review,
    $pack_id,
    $pack_name, $translate_shown,
    $word_list,
    DeckG,
    get_pack_fx,
    send_progress_fx,
    set_again,
    set_easy,
    set_good,
    set_hard, show_translate
} from './dictionary';
import { add, always, converge, nthArg, pipe, prop } from 'ramda';
import { DeckItemDetailed, DeckStats, Word } from '../../../types/vocabulary';
import { ParsedResponse } from '../../../utils/request';

sample({
    clock: DeckG.open,
    target: get_pack_fx
});

$pack_name
    .on(get_pack_fx.doneData, pipe(
        nthArg(1),
        prop('data'),
        prop('name')
    ))
    .reset(DeckG.close);

$pack_id
    .on(get_pack_fx.doneData, pipe(
        nthArg(1),
        prop('data'),
        prop('id')
    ))
    .reset(DeckG.close);

$count_new
    .on(get_pack_fx.doneData, pipe(
        nthArg(1),
        prop('data'),
        prop('stats'),
        prop('count_new')
    ))
    .on(send_progress_fx.doneData, pipe(
        nthArg(1),
        prop('data'),
        prop('count_new')
    ))
    .reset(DeckG.close);

$count_learning
    .on(get_pack_fx.doneData, pipe<[number, ParsedResponse<DeckItemDetailed>], ParsedResponse<DeckItemDetailed>, DeckItemDetailed, DeckStats, number>(
        nthArg(1),
        prop('data'),
        prop('stats'),
        converge(add, [
            prop('count_learning'),
            prop('count_relearning')
        ])
    ))
    .on(send_progress_fx.doneData, pipe<[number, ParsedResponse<Omit<DeckStats, 'count_can_be_shown'>>], ParsedResponse<Omit<DeckStats, 'count_can_be_shown'>>, Omit<DeckStats, 'count_can_be_shown'>, number>(
        nthArg(1),
        prop('data'),
        converge(add, [
            prop('count_learning'),
            prop('count_relearning')
        ])
    ))
    .reset(DeckG.close);

$count_review
    .on(get_pack_fx.doneData, pipe(
        nthArg(1),
        prop('data'),
        prop('stats'),
        prop('count_review')
    ))
    .on(send_progress_fx.doneData, pipe(
        nthArg(1),
        prop('data'),
        prop('count_review')
    ))
    .reset(DeckG.close);

$word_list
    .on(get_pack_fx.doneData, pipe(
        nthArg(1),
        prop('data'),
        prop('words'),
    ))
    .reset(DeckG.close);

$active_word_index
    .on(send_progress_fx.doneData, pipe(
        nthArg(0),
        add(1)
    ))
    .reset(DeckG.close);

$translate_shown
    .on(show_translate, always(true))
    .reset(send_progress_fx.doneData)
    .reset(DeckG.close);

enum Rating {
    Again = 1,
    Hard = 2,
    Good = 3,
    Easy = 4,
}

const make_fn = (rating: Rating) => ({ word, pack_id }: { word: Word, pack_id: number }) => ({
    pack_id,
    word_id: word.id,
    student_choice: rating
});

sample({
    clock: set_again,
    source: { word: $active_word, pack_id: $pack_id },
    fn: make_fn(Rating.Again),
    target: send_progress_fx
});

sample({
    clock: set_hard,
    source: { word: $active_word, pack_id: $pack_id },
    fn: make_fn(Rating.Hard),
    target: send_progress_fx
});

sample({
    clock: set_good,
    source: { word: $active_word, pack_id: $pack_id },
    fn: make_fn(Rating.Good),
    target: send_progress_fx
});

sample({
    clock: set_easy,
    source: { word: $active_word, pack_id: $pack_id },
    fn: make_fn(Rating.Easy),
    target: send_progress_fx
});

import { sample } from 'effector';
import {
    $count_learning,
    $count_new,
    $count_review,
    $pack_id,
    $pack_name,
    $translate_shown,
    $words_collection,
    DeckG,
    get_pack_fx,
    send_progress_fx,
    set_again,
    set_easy,
    set_good,
    set_hard,
    show_translate
} from './dictionary';
import { add, always, converge, nthArg, pipe, prop } from 'ramda';
import { WordCollection } from '../WordCollection';

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
        prop('stats'),
        prop('count_new')
    ))
    .reset(DeckG.close);

$count_learning
    .on(get_pack_fx.doneData, pipe(
        nthArg(1),
        prop('data'),
        prop('stats'),
        converge(add, [
            prop('count_learning'),
            prop('count_relearning')
        ])
    ))
    .on(send_progress_fx.doneData, pipe(
        nthArg(1),
        prop('data'),
        prop('stats'),
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
        prop('stats'),
        prop('count_review')
    ))
    .reset(DeckG.close);

$words_collection
    .on(get_pack_fx.doneData, pipe(
        nthArg(1),
        prop('data'),
        prop('words'),
        WordCollection.create
    ))
    .on(send_progress_fx.doneData, (collection, { data }) =>
        collection!.update(data.word)
    )
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

const make_fn = (rating: Rating) => ({ word, pack_id }: { word: WordCollection | null, pack_id: number }) => ({
    pack_id,
    word_id: word!.active_word!.id,
    student_choice: rating
});

sample({
    clock: set_again,
    source: { word: $words_collection, pack_id: $pack_id },
    fn: make_fn(Rating.Again),
    target: send_progress_fx
});

sample({
    clock: set_hard,
    source: { word: $words_collection, pack_id: $pack_id },
    fn: make_fn(Rating.Hard),
    target: send_progress_fx
});

sample({
    clock: set_good,
    source: { word: $words_collection, pack_id: $pack_id },
    fn: make_fn(Rating.Good),
    target: send_progress_fx
});

sample({
    clock: set_easy,
    source: { word: $words_collection, pack_id: $pack_id },
    fn: make_fn(Rating.Easy),
    target: send_progress_fx
});

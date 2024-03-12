import { attach, sample } from 'effector';
import {
    $count_learning,
    $count_new,
    $count_review,
    $deck_open_time,
    $pack_id,
    $pack_name,
    $translate_shown,
    $viewed_words,
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
import { send_analytics_fx } from '../../../models/core';

sample({
    clock: DeckG.open,
    target: get_pack_fx
});

sample({
    clock: DeckG.open,
    target: attach({
        mapParams: always({
            event_type: 'WebApp Vocabulary Education Start'
        }),
        effect: send_analytics_fx
    })
});

sample({
    clock: DeckG.close,
    target: attach({
        source: { time_open: $deck_open_time, viewed: $viewed_words },
        mapParams: (_, { time_open, viewed }) => ({
            event_type: 'WebApp Vocabulary Education Ended',
            props: {
                education_time: Math.round((((Date.now() - time_open) / 1_000 / 60) + Number.EPSILON) * 100) / 100,
                viewed_words_count: viewed
            }
        }),
        effect: send_analytics_fx
    })
});

sample({
    clock: show_translate,
    target: attach({
        mapParams: always({
            event_type: 'WebApp Vocabulary Show Answer Click'
        }),
        effect: send_analytics_fx
    })
});

[
    { name: 'Again', event: set_again },
    { name: 'Hard', event: set_hard },
    { name: 'Good', event: set_good },
    { name: 'Easy', event: set_easy }
].forEach(({ name, event }) => {
    sample({
        clock: event,
        target: attach({
            mapParams: always({
                event_type: `WebApp Vocabulary ${name} Click`
            }),
            effect: send_analytics_fx
        })
    });
});

$viewed_words
    .on(show_translate, add(1))
    .reset(DeckG.close);

$deck_open_time
    .on(DeckG.open, () => Date.now())
    .reset(DeckG.close);

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

import { attach, sample } from 'effector';
import {
    $pack_id,
    $pack_name,
    DeckG,
    get_pack_fx,
    set_again,
    set_easy,
    set_good,
    set_hard,
    show_translate
} from './dictionary';
import { coreD, send_analytics_fx } from '../../../models/core';
import { add } from 'ramda';
import { previous } from 'patronum';

const $deck_open_time = coreD.createStore(0);
const $viewed_words = coreD.createStore(0);

const $last_id = previous($pack_id, 0);
const $last_name = previous($pack_name, '');


sample({
    clock: get_pack_fx.doneData,
    target: attach({
        mapParams: ({ data: { name, id } }) => ({
            event_type: 'WebApp Vocabulary Education Start',
            props: {
                vocabulary_name: name,
                vocabulary_id: id
            }
        }),
        effect: send_analytics_fx
    })
});

sample({
    clock: show_translate,
    target: attach({
        source: { name: $pack_name, id: $pack_id },
        mapParams: (_, { name, id }) => ({
            event_type: 'WebApp Vocabulary Show Answer Click',
            props: {
                vocabulary_name: name,
                vocabulary_id: id
            }
        }),
        effect: send_analytics_fx
    })
});

sample({
    clock: DeckG.close,
    source: { id: $last_id, name: $last_name },
    target: attach({
        source: { time_open: $deck_open_time, viewed: $viewed_words },
        mapParams: ({ id, name }, { time_open, viewed }) => ({
            event_type: 'WebApp Vocabulary Education Ended',
            props: {
                education_time: Math.round((((Date.now() - time_open) / 1_000 / 60) + Number.EPSILON) * 100) / 100,
                viewed_words_count: viewed,
                vocabulary_name: name,
                vocabulary_id: id
            }
        }),
        effect: send_analytics_fx
    })
});

[
    { button_name: 'Again', event: set_again },
    { button_name: 'Hard', event: set_hard },
    { button_name: 'Good', event: set_good },
    { button_name: 'Easy', event: set_easy }
].forEach(({ button_name, event }) => {
    sample({
        clock: event,
        target: attach({
            source: { name: $pack_name, id: $pack_id },
            mapParams: (_, { name, id }) => ({
                event_type: `WebApp Vocabulary ${button_name} Click`,
                props: {
                    vocabulary_name: name,
                    vocabulary_id: id
                }
            }),
            effect: send_analytics_fx
        })
    });
});

$viewed_words
    .on(show_translate, add(1))
    .reset(DeckG.open);

$deck_open_time
    .on(DeckG.open, () => Date.now());
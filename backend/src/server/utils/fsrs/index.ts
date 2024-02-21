import { Card, FSRS, Rating } from 'fsrs.js';
import { info } from '../../../utils/log';
import dayjs from 'dayjs';

export class WordCard extends Card {
    public readonly word_id: number;

    constructor(word_id: number) {
        super();
        this.word_id = word_id;
    }
}

const fsrs = new FSRS();
const word = new WordCard(1);

Object.assign(word, {
    "due": new Date("2024-02-14T13:25:09.506Z"),
    "stability": 0.6,
    "difficulty": 5.869999999999999,
    "elapsed_days": 0,
    "scheduled_days": 0,
    "reps": 1,
    "lapses": 0,
    "state": 1,
    "last_review": new Date("2024-02-14T13:20:09.506Z"),
    "word_id": 1
});

const scheduling_cards = fsrs.repeat(word, dayjs().subtract(1, 'd').toDate());

info(scheduling_cards);

const repeated = scheduling_cards[Rating.Hard];

info(repeated);
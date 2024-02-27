import { LearnCard as LearnCardT } from '../../../types/Wokobular';
import { Card, FSRS, Rating, State } from 'fsrs.js';

const fsrs = new FSRS();

export class LearnCard implements LearnCardT<Date> {
    public readonly student_id: number;
    public readonly word_id: number;
    public readonly due: Date;
    public readonly stability: number;
    public readonly difficulty: number;
    public readonly elapsed_days: number;
    public readonly scheduled_days: number;
    public readonly reps: number;
    public readonly lapses: number;
    public readonly state: State;
    public readonly last_review: Date;

    constructor(card: LearnCardT<Date>) {
        this.word_id = card.word_id;
        this.student_id = card.student_id;
        this.due = card.due;
        this.stability = card.stability;
        this.difficulty = card.difficulty;
        this.elapsed_days = card.elapsed_days;
        this.scheduled_days = card.scheduled_days;
        this.reps = card.reps;
        this.lapses = card.lapses;
        this.state = card.state;
        this.last_review = card.last_review;
    }

    public update(rating: Rating): LearnCard {
        const card = fsrs.repeat(this, new Date())[rating].card;
        return new LearnCard({ ...this, ...card });
    }

    public to_bd(): LearnCardT {
        return {
            ...this,
            due: this.due.toISOString(),
            last_review: this.last_review.toISOString()
        };
    }

    public static from_bd(card: LearnCardT): LearnCard {
        return new LearnCard({
            ...card,
            due: new Date(card.due),
            last_review: new Date(card.last_review)
        });
    }

    public static empty(data: Pick<LearnCardT, 'word_id' | 'student_id'>): LearnCard {
        return new LearnCard({ ...new Card(), ...data });
    }
}
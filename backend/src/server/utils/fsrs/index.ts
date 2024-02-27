import { Rating } from 'fsrs.js';
import { knex } from '../../../constants';
import { head, map } from 'ramda';
import { LearnCard } from './LearnCard';
import { LearnCard as LearnCardT } from '../../../types/Wokobular';

export const update_word = ({ word_id, student_id, rating }: WordUpdateProps) =>
    knex('learn_cards')
        .select('*')
        .where({
            word_id,
            student_id
        })
        .then(map(LearnCard.from_bd))
        .then<LearnCard | undefined>(head)
        .then((saved_card) => {
            const card = saved_card
                ?? LearnCard.empty({ student_id, word_id });

            const updated_card = card.update(rating);

            return knex('learn_cards')
                .insert(updated_card.to_bd())
                .onConflict(['word_id', 'student_id'])
                .merge()
                .returning('*')
                .then<LearnCardT>(head);
        });

export type WordUpdateProps = {
    word_id: number;
    rating: Rating;
    student_id: number;
}
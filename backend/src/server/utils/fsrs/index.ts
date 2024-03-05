import { Rating } from 'fsrs.js';
import { knex } from '../../../constants';
import { head, identity, map, pipe } from 'ramda';
import { LearnCard } from './LearnCard';
import { Word, WordStatus } from '../../../types/Wokobular';
import { BadRequest } from '../../middlewares/errors';

export const update_word = ({ word_id, student_id, rating }: WordUpdateProps) =>
    Promise
        .all([
            knex('learn_cards')
                .select('*')
                .where({
                    word_id,
                    student_id
                })
                .then(map(LearnCard.from_bd))
                .then<LearnCard | undefined>(head),
            knex('words')
                .select('*')
                .where({
                    id: word_id,
                    status: WordStatus.Active
                })
                .then<Word | undefined>(head)
        ])
        .then(([saved_card, word]) => {
            if (!word) {
                throw new BadRequest('Wrong word id!');
            }

            const card = saved_card ?? LearnCard.empty({ student_id, word_id });

            const updated_card = card.update(rating);

            return knex('learn_cards')
                .insert(updated_card.to_bd())
                .onConflict(['word_id', 'student_id'])
                .merge()
                .returning('*')
                .then(map(LearnCard.from_bd))
                .then<LearnCard>(head)
                .then((card) => ({ card, word }));
        });

export type WordUpdateProps = {
    word_id: number;
    rating: Rating;
    student_id: number;
}
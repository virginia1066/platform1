import { knex } from '../constants';
import { WordStatus } from '../types/Wokobular';
import { defaultTo, evolve, head } from 'ramda';

export const get_stats_by_pack = ({ pack_id, student_id }: GetPackStatsProps): Promise<StatByPack> =>
    knex('pack_links')
        .where({ pack_id })
        .innerJoin('words as w', function () {
            this.on('pack_links.word_id', 'w.id')
                .andOn('w.status', knex.raw('?', [WordStatus.Active]));
        })
        .leftJoin('learn_cards as lc', function () {
            this.on('w.id', 'lc.word_id')
                .andOn('lc.student_id', knex.raw('?', [student_id]));
        })
        .select<StatByPack[]>(
            knex.raw('COUNT(w.id) as words_count'),
            knex.raw('SUM(CASE WHEN CAST(lc.state AS INTEGER) = 0 THEN 1 ELSE 0 END) + COUNT(CASE WHEN lc IS NULL THEN 1 END) AS count_new'),
            knex.raw('SUM(CASE WHEN CAST(lc.state AS INTEGER) = 1 THEN 1 ELSE 0 END) AS count_learning'),
            knex.raw('SUM(CASE WHEN CAST(lc.state AS INTEGER) = 2 THEN 1 ELSE 0 END) AS count_review'),
            knex.raw('SUM(CASE WHEN CAST(lc.state AS INTEGER) = 3 THEN 1 ELSE 0 END) AS count_relearning'),
            knex.raw('SUM(CASE WHEN lc.due < CURRENT_TIMESTAMP THEN 1 ELSE 0 END) + COUNT(CASE WHEN lc IS NULL THEN 1 END) as count_can_be_shown')
        )
        .then<StatByPack | undefined>(head)
        .then(defaultTo({
            words_count: 0,
            count_new: 0,
            count_learning: 0,
            count_review: 0,
            count_relearning: 0,
            count_can_be_shown: 0
        }))
        .then(evolve({
            words_count: Number,
            count_learning: Number,
            count_new: Number,
            count_review: Number,
            count_relearning: Number,
            count_can_be_shown: Number
        }));


export type GetPackStatsProps = {
    pack_id: number;
    student_id: number;
}

export type StatByPack = {
    count_new: number;
    words_count: number;
    count_learning: number;
    count_review: number;
    count_relearning: number;
    count_can_be_shown: number;
}

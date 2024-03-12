import { knex } from '../../constants';
import { PackStatus, WordStatus } from '../../types/Wokobular';
import { applySpec, map, pipe, prop } from 'ramda';

export const get_user_packs = ({ student_id }: GetUserPackProps) =>
    knex('packs as p')
        .where('p.status', PackStatus.Active)
        .innerJoin('pack_links as pl', 'p.id', 'pl.pack_id')
        .innerJoin('words as w', function () {
            this.on('pl.word_id', 'w.id')
                .andOn('w.status', knex.raw('?', [WordStatus.Active]));
        })
        .leftJoin('learn_cards as lc', function () {
            this.on('w.id', 'lc.word_id')
                .andOn('lc.student_id', knex.raw('?', [student_id]));
        })
        .whereIn('p.parent_user_id', [student_id, '0'])
        .groupBy('p.id')
        .select<PackStat<string>[]>(
            'p.id AS id',
            'p.name AS name',
            'p.user_can_edit as user_can_edit',
            knex.raw('COUNT(w.id) as words_count'),
            knex.raw('SUM(CASE WHEN CAST(lc.state AS INTEGER) = 0 THEN 1 ELSE 0 END) + COUNT(CASE WHEN lc IS NULL THEN 1 END) AS count_new'),
            knex.raw('SUM(CASE WHEN CAST(lc.state AS INTEGER) = 1 THEN 1 ELSE 0 END) AS count_learning'),
            knex.raw('SUM(CASE WHEN CAST(lc.state AS INTEGER) = 2 THEN 1 ELSE 0 END) AS count_review'),
            knex.raw('SUM(CASE WHEN CAST(lc.state AS INTEGER) = 3 THEN 1 ELSE 0 END) AS count_relearning'),
            knex.raw('SUM(CASE WHEN lc.due < CURRENT_TIMESTAMP THEN 1 ELSE 0 END) + COUNT(CASE WHEN lc IS NULL THEN 1 END) as count_can_be_shown')
        )
        .then(map(
            applySpec<any>({
                name: prop('name'),
                id: prop('id'),
                user_can_edit: prop('user_can_edit'),
                stats: applySpec({
                    count_new: pipe(prop('count_new'), Number),
                    count_learning: pipe(prop('count_learning'), Number),
                    count_review: pipe(prop('count_review'), Number),
                    count_relearning: pipe(prop('count_relearning'), Number),
                    words_count: pipe(prop('words_count'), Number),
                    count_can_be_shown: pipe(prop('count_can_be_shown'), Number),
                })
            }))
        );

export type GetUserPackProps = {
    student_id: number;
}

type PackStat<Int = number> = {
    id: number;
    name: string;
    count_new: Int;
    count_learning: Int;
    count_review: Int;
    count_relearning: Int;
    words_count: Int;
    count_can_be_shown: Int;
};

import { knex } from '../constants';
import { head } from 'ramda';


export function get_student_by_tg(tg_user_id: number): Promise<number | undefined>;
export function get_student_by_tg(tg_user_id: number, strict: true): Promise<number>;
export function get_student_by_tg(tg_user_id: number, strict?: boolean): Promise<number | undefined> {
    return knex('tg_users')
        .select('mk_id')
        .where({ tg_id: tg_user_id })
        .then<{ mk_id: number } | undefined>(head)
        .then((data): number | undefined => {
            if (!data && strict) {
                throw new Error(`Has no user with id ${tg_user_id}!`);
            }

            return data?.mk_id;
        });
}
import { knex } from '../constants';
import { head } from 'ramda';
import { ServerError } from '../server/middlewares/errors';


export function get_student_by_tg(tg_user_id: number): Promise<number | undefined>;
export function get_student_by_tg(tg_user_id: number, strict: true): Promise<number>;
export function get_student_by_tg(tg_user_id: number, strict: boolean): Promise<number | undefined>;
export function get_student_by_tg(tg_user_id: number, strict: true, Constructor?: IServerError): Promise<number>;
export function get_student_by_tg(tg_user_id: number, strict?: boolean, Constructor?: IServerError): Promise<number | undefined> {
    return knex('tg_users')
        .select('mk_id')
        .where({ tg_id: tg_user_id })
        .then<{ mk_id: number } | undefined>(head)
        .then((data): number | undefined => {
            if (!data && strict) {
                const text = `Has no user with id ${tg_user_id}!`;
                if (Constructor) {
                    throw new Constructor(text);
                } else {
                    throw new Error(text);
                }
            }

            return data?.mk_id;
        });
}

interface IServerError {
    new(message?: string): ServerError;
}
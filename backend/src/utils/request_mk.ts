import { knex, MY_CLASS_API_KEY, REQUEST_QUEUE } from '../constants';
import fetch from 'node-fetch';
import { parse_response } from './parse_response';
import dayjs from 'dayjs';
import { pick } from 'ramda';
import { MyClass } from '../types/my_class';

const get_token_from_api = () =>
    REQUEST_QUEUE.push(() => fetch(`https://api.moyklass.com/v1/company/auth/getToken`, {
        method: 'POST',
        body: JSON.stringify({ apiKey: MY_CLASS_API_KEY }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then<GetTokenResponse>(parse_response));

const get_api_token = (): Promise<{ token: string }> =>
    knex('access_tokens')
        .select('*')
        .where('expiredAt', '>=', dayjs().add(1, 'hour').toISOString())
        .orderBy('expiredAt', 'desc')
        .then((tokens) => {
            const token = tokens.pop();

            if (!token) {
                return get_token_from_api()
                    .then((token_info) => {
                        return knex('access_tokens')
                            .insert([{ token: token_info.accessToken, expiredAt: token_info.expiresAt }])
                            .then(() => ({ token: token_info.accessToken }));
                    });
            }

            return pick(['token'], token);
        });

export const get_student = ({ student_id }: GetStudentProps) =>
    get_api_token()
        .then(({ token }) =>
            REQUEST_QUEUE.push(() => fetch(`https://api.moyklass.com/v1/company/users/${student_id}`, {
                    method: 'GET',
                    headers: {
                        'X-Access-Token': token
                    }
                }).then<GetStudentResponse>(parse_response)
            ));

export const update_student = (student_id: number, update_props: UpdateStudentProps) =>
    get_api_token()
        .then(({ token }) =>
            REQUEST_QUEUE.push(() => fetch(`https://api.moyklass.com/v1/company/users/${student_id}`, {
                    method: 'POST',
                    body: JSON.stringify(update_props),
                    headers: {
                        'X-Access-Token': token
                    }
                }).then<GetStudentResponse>(parse_response)
            ));

export const get_all_attributes = () =>
    get_api_token()
        .then(({ token }) =>
            REQUEST_QUEUE.push(() => fetch(`https://api.moyklass.com/v1/company/userAttributes`, {
                    method: 'GET',
                    headers: {
                        'X-Access-Token': token
                    }
                }).then<Array<MyClass.Attribute>>(parse_response)
            ));

export type GetStudentProps = {
    student_id: number;
}

export type UpdateStudentProps = {
    name: string;
    email?: string | null;
    phone?: string;
    advSourceId?: number | null;
    createSourceId?: number | null;
    statusChangeReasonId?: number;
    clientStateId?: number;
    filials?: Array<number>;
    responsibles?: Array<number>;
    attributes?: Array<{ attributeId: number; value: string; }>
}

export type GetStudentResponse = {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    updatedAt: string;
    createdAt: string;
    balans: number;
    availableBalance: number;
    responsibleId: number;
    advSourceId: number | null;
    createSourceId: number;
    statusChangeReasonId: null;
    stateChangedAt: null;
    clientStateId: number;
    filials: Array<number>;
    responsibles: Array<number>;
    attributes: Array<MyClass.StudentAttribute>;
}

export type GetTokenResponse = {
    accessToken: string;
    expiresAt: string;
    level: string;
}
import { createHmac } from 'node:crypto';
import { info } from '../../utils/log';
import { TG_TOKEN } from '../../constants';
import { yup_validate_sync } from '../../utils/yup_validate';
import { number, object, string } from 'yup';
import { BadRequest, ServerError } from '../middlewares/errors';
import { User } from 'node-telegram-bot-api';
import { make_id } from '../../utils/make_id';
import { randomUUID } from 'crypto';
import { BigNumber } from '@waves/bignumber';

export const validate_webapp_data = (init_data: string) => {
    try {
        info(`Validate webapp data: ${init_data}`);
        const secret = createHmac('sha256', 'WebAppData')
            .update(TG_TOKEN);

        const raw_data = init_data.split('&')
            .map((str) => {
                const [key, value] = str.split('=');
                return { key, value: decodeURIComponent(value) };
            })
            .reduce<Partial<Record<string, string>>>((acc, { key, value }) =>
                    Object.assign(acc, { [key]: value }),
                Object.create(null)
            );

        const init_schema = object().shape({
            query_id: string().required(),
            auth_date: number().required().integer(),
            hash: string().required(),
            user: string().required()
        });

        const user_schema = object().shape({
            id: number().required().integer()
        });

        const tg_data = yup_validate_sync(init_schema, raw_data);
        const target_data = {
            ...tg_data,
            user: yup_validate_sync(user_schema, JSON.parse(tg_data.user))
        };

        const hash = raw_data.hash;

        if (hash === process.env.TEST_HASH) {
            info(`Used test hash for auth!`);
            return target_data;
        }

        if (!hash) {
            throw new Error(`Has no hash in init data!`);
        }

        const check_string = Object
            .entries(raw_data)
            .filter(([k]) => k !== 'hash')
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');

        info(`Check string:`, check_string);

        const calculated_hash = createHmac('sha256', secret.digest())
            .update(check_string)
            .digest('hex');

        info(calculated_hash, hash);

        if (calculated_hash === hash) {
            return target_data;
        }

        const error_message = [
            'Data integrity check failed.',
            'The received hash does not match the expected value.',
            'The data may have been tampered with or corrupted during transmission.'
        ].join('\n');
        throw new Error(error_message);
    } catch (e: any) {
        if (e instanceof ServerError) {
            throw e;
        } else {
            throw new BadRequest(e.message);
        }
    }
};

export const make_test_auth = (tg_id: number) => {
    const secret = createHmac('sha256', 'WebAppData')
        .update(TG_TOKEN);

    const tg_user: User = {
        id: tg_id,
        is_bot: false,
        first_name: 'Test',
    };
    const query_id = make_id(randomUUID());
    const auth_date = new BigNumber(Date.now())
        .div(1_000)
        .roundTo(0)
        .toString()
    const user = encodeURIComponent(JSON.stringify(tg_user));

    const check_string = Object
        .entries({
            query_id,
            auth_date,
            user: JSON.stringify(tg_user)
        })
        .filter(([k]) => k !== 'hash')
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

    info(`Check string: ${check_string}`);

    const hash = createHmac('sha256', secret.digest())
        .update(check_string)
        .digest('hex');

    const result = [
        `auth_date=${auth_date}`,
        `user=${user}`,
        `query_id=${query_id}`,
        `hash=${hash}`
    ].join('&');

    info(`Test string: ${result}`);

    return result;
}

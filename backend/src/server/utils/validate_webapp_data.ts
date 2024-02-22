import { createHmac } from 'node:crypto';
import { info } from '../../utils/log';
import { TG_TOKEN } from '../../constants';
import { yup_validate_sync } from '../../utils/yup_validate';
import { number, object, string } from 'yup';
import { BadRequest, ServerError } from '../middlewares/errors';

export const validate_webapp_data = (init_data: string) => {
    try {
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


info(validate_webapp_data('query_id=AAHdpaUHAAAAAN2lpQerNKd8&user=%7B%22id%22%3A128296413%2C%22first_name%22%3A%22Daniil%22%2C%22last_name%22%3A%22Tsigelnitskiy%22%2C%22username%22%3A%22tsDaniil%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1708599037&hash=7ae25447aacb9991ac318be68dddb5ccc76c12168cbfb5fe496cbec423cb68b0'));

process.exit(0);
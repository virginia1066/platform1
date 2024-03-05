import { AuthState, MiddlewareWithToken } from '../../../../../middlewares/check_token_M';
import { yup_validate } from '../../../../../../utils/yup_validate';
import { array, object, string, TestFunction, ValidationError } from 'yup';
import { knex, MAX_WORD_LENGTH } from '../../../../../../constants';
import { getFixedT } from 'i18next';
import { get_or_create_pack } from '../../../../../../utils/get_or_create_pack';
import { randomUUID } from 'crypto';
import { ParameterizedContext } from 'koa';
import { Pack, Word, WordSource, WordStatus } from '../../../../../../types/Wokobular';
import { always, assoc, head } from 'ramda';
import { add_pack_words } from '../../../../../utils/words/add_pack_words';
import { set_body } from '../../../../../utils/set_body';

const t = getFixedT('transaction', undefined, 'server.errors');
const tServer = getFixedT('transaction', undefined, 'server');

const trim_transform = (value: string | undefined) =>
    value ? value.trim() : value;

const check_name_by_forbidden_list: TestFunction<string> = (value: string, context): boolean | ValidationError => {
    const is_error = [tServer('home_task_pack')].includes(value);
    if (!is_error) {
        return true;
    }

    return new ValidationError(t('name_home_task', {
        name: tServer('home_task_pack')
    }), value, context.path, context.schema?.type);
};

const get_test_duplicate: (ctx: ParameterizedContext<AuthState>) => TestFunction<string> =
    (ctx) => (name, context): Promise<boolean | ValidationError> =>
        knex('packs')
            .where({
                name,
                parent_user_id: ctx.state.student_id
            })
            .then<Pack | undefined>(head)
            .then((pack) => {
                if (!pack) {
                    return true;
                }
                const message = t('name_home_task', { name });
                return new ValidationError(message, name, context.path, context.schema?.type);
            });

const get_schema = (ctx: ParameterizedContext<AuthState>) =>
    object().shape({
        name: string()
            .transform(trim_transform).required()
            .test('test_name', check_name_by_forbidden_list)
            .test('test_duplicate_name', get_test_duplicate(ctx)),
        words: array().required().min(1, t('words.min')).of(object().shape({
            en: string()
                .transform(trim_transform)
                .required(t('words.word_min'))
                .max(MAX_WORD_LENGTH, t('words.word_max')),
            ru: string()
                .transform(trim_transform)
                .required(t('words.word_min'))
                .max(MAX_WORD_LENGTH, t('words.word_max')),
            status: string()
                .required()
                .oneOf([
                    WordStatus.Active,
                    WordStatus.Deleted
                ])
        }))
    });

export const create_pack_M: MiddlewareWithToken = (ctx, next) =>
    yup_validate(get_schema(ctx), ctx.request.body)
        .then(({ name, words }) => {
            const insert_id = randomUUID();

            return get_or_create_pack({
                name,
                user_can_edit: true,
                parent_user_id: ctx.state.student_id,
                insert_id
            }).then(pack => add_pack_words(
                pack,
                words.map<Omit<Word, 'insert_id' | 'id'>>(assoc('source', WordSource.UserAdd)),
                insert_id
            )).then(always({ ok: true }));
        })
        .then(set_body(ctx))
        .then(next);

import { MiddlewareWithToken } from '../../../../../middlewares/check_token_M';
import { yup_validate } from '../../../../../../utils/yup_validate';
import { array, object, string, TestFunction, ValidationError } from 'yup';
import { knex } from '../../../../../../constants';
import { t } from 'i18next';
import { error, info } from '../../../../../../utils/log';

const trim_transform = (value: string | undefined) =>
    value ? value.trim() : value;

const check_name_by_forbidden_list: TestFunction<string> = (value: string, context): boolean | ValidationError => {
    const is_error = [t('server.home_task_pack')].includes(value);
    if (!is_error) {
        return true;
    }

    return new ValidationError(t('server.errors.name_home_task', {
        name: t('server.home_task_pack')
    }), value, context.path, context.schema?.type);
};

yup_validate(object().shape({
    name: string().transform(trim_transform).required()
        .test('test_name', check_name_by_forbidden_list),
    words: array().required().min(1).of(object().shape({
        en: string().transform(trim_transform).required(),
        ru: string().transform(trim_transform).required()
    }))
}), {
    name: '123',
    words: []
}).then(info, error);

// export const create_pack_M: MiddlewareWithToken = (ctx, next) =>
//     yup_validate(object().shape({
//         name: string().transform(trim_transform).required()
//             .test('test_name', check_name_by_forbidden_list),
//         words: array().required().min(1).of(object().shape({
//             en: string().transform(trim_transform).required(),
//             ru: string().transform(trim_transform).required()
//         }))
//     }), ctx.request.body)
//         .then(({ name, words }) => {
//             return knex('packs')
//                 .select('*')
//                 .where({
//                     parent_user_id: ctx.state.student_id,
//                     name
//                 });
//
//         });

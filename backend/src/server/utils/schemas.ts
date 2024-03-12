import { array, number, object, string, ValidationError } from 'yup';
import { getFixedT } from 'i18next';
import { knex, MAX_PACK_NAME_LENGTH, MAX_WORD_LENGTH, SYSTEM_PACK_ID } from '../../constants';
import { Pack, PackStatus, WordStatus } from '../../types/Wokobular';
import { head } from 'ramda';

const t = getFixedT(null, null, 'server.errors');
const tServer = getFixedT(null, null, 'server');

const trim_transform = (value: string | undefined) =>
    value ? value.trim() : value;

const context_schema = object().shape({
    student_id: number().required()
});

export const pack_id = number()
    .required(t('required'))
    .integer();

export const delete_pack_id = pack_id
    .clone()
    .test('delete_pack_id', (id, context) => {
        const { student_id } = context_schema.validateSync(context.options.context);

        return knex('packs')
            .where('id', id)
            .then<Pack | undefined>(head)
            .then((pack) => {
                if (!pack) {
                    return context.createError({
                        message: `Has no pack for delete!`
                    });
                }
                if (!pack.user_can_edit || pack.parent_user_id !== student_id) {
                    return context.createError({
                        message: 'Permission denied!'
                    });
                }
                return true;
            });
    });

export const pack_name = string()
    .required(t('required'))
    .transform(trim_transform)
    .max(MAX_PACK_NAME_LENGTH, t('max'));

export const pack_word = string()
    .required(t('required'))
    .transform(trim_transform)
    .max(MAX_WORD_LENGTH, t('max'));

export const word_status = string()
    .required()
    .oneOf([WordStatus.Active, WordStatus.Deleted]);

export const words = array()
    .required(t('required'))
    .min(1);

export const pack_name_create =
    pack_name
        .clone()
        .test({
            name: 'pack_name_create',
            test: (name, context) => {
                const create_error = () => {
                    const message = t('name_home_task', { name });
                    return new ValidationError(message, name, context.path, context.schema?.type);
                };
                const is_error = [tServer('home_task_pack')].includes(name);

                if (is_error) {
                    return create_error();
                }

                const { student_id } = context_schema.validateSync(context.options.context, { abortEarly: true });

                return knex('packs')
                    .where({
                        name,
                        parent_user_id: student_id,
                        status: PackStatus.Active
                    })
                    .then<Pack | undefined>(head)
                    .then((pack) => {
                        if (!pack) {
                            return true;
                        }
                        return create_error();
                    });
            }
        });

export const pack_name_edit = pack_name
    .clone()
    .test('pack_name_edit', (name, context) => {
        const { pack_id, student_id } = object().shape({
            pack_id: number().required().integer(),
            student_id: number().required().integer()
        }).validateSync(context.options.context);

        return Promise
            .all([
                knex('packs')
                    .where('id', pack_id)
                    .then<Pack | undefined>(head),
                knex('packs')
                    .where('name', name)
                    .where('status', PackStatus.Active)
                    .where('id', '!=', pack_id)
                    .where('parent_user_id', 'in', [SYSTEM_PACK_ID, student_id])
            ])
            .then(([pack, list]) => {
                if (!pack) {
                    return context.createError({
                        message: `Has no pack with id ${pack_id}`
                    });
                }
                if (!pack.user_can_edit) {
                    return context.createError({
                        message: `Can't edit this pack!`
                    });
                }
                if (pack.parent_user_id !== student_id) {
                    return context.createError({
                        message: 'Permission denied!'
                    });
                }
                if (list.length) {
                    return context.createError({
                        message: t('name_home_task', { name })
                    });
                }

                return true;
            });
    });
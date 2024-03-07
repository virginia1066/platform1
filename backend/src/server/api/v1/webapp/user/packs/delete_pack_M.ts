import { MiddlewareWithToken } from '../../../../../middlewares/check_token_M';
import { object } from 'yup';
import { yup_validate } from '../../../../../../utils/yup_validate';
import { knex } from '../../../../../../constants';
import { PackStatus } from '../../../../../../types/Wokobular';
import { get_user_packs } from '../../../../../utils/get_user_packs';
import { set_body } from '../../../../../utils/set_body';
import { delete_pack_id } from '../../../../../utils/schemas';

const schema = object().shape({
    pack_id: delete_pack_id
});

export const delete_pack_M: MiddlewareWithToken = (ctx, next) =>
    yup_validate(schema, ctx.params, ctx.state)
        .then(({ pack_id }) =>
            Promise.all([
                knex('packs')
                    .update('status', PackStatus.Deleted)
                    .where('id', pack_id),
                knex('pack_links')
                    .del()
                    .where('pack_id', pack_id)
            ])
        )
        .then(() => get_user_packs({ student_id: ctx.state.student_id }))
        .then(set_body(ctx))
        .then(next);

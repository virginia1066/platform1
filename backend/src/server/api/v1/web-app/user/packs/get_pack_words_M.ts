import { MiddlewareWithToken } from '../../../../../middlewares/check_token_M';
import { number, object } from 'yup';
import { yup_validate } from '../../../../../../utils/yup_validate';
import { knex, SYSTEM_PACK_ID } from '../../../../../../constants';
import { Pack, Word, WordStatus } from '../../../../../../types/Wokobular';
import { always, applySpec, head, identity } from 'ramda';
import { NotFound, PermissionDenied } from '../../../../../middlewares/errors';
import { set_body } from '../../../../../utils/set_body';
import { get_words_by_pack } from '../../../../../../utils/get_words_by_pack';


const schema = object().shape({
    pack_id: number().required().integer()
});

export const get_pack_words_M: MiddlewareWithToken = (ctx, next) =>
    yup_validate(schema, ctx.params)
        .then(({ pack_id }) =>
            knex('packs')
                .select('*')
                .where('id', pack_id)
                .then<Pack | undefined>(head)
                .then((pack) => {
                    if (!pack) {
                        throw new NotFound();
                    }
                    if (![SYSTEM_PACK_ID, ctx.state.token.user_id].includes(pack.parent_user_id)) {
                        throw new PermissionDenied();
                    }

                    return get_words_by_pack(pack.id)
                        .then(applySpec({
                            pack_name: always(pack.name),
                            pack_id: always(pack.id),
                            words: identity
                        }));
                })
        )
        .then(set_body(ctx))
        .then(next);
import { MiddlewareWithToken } from '../../../../../middlewares/check_token_M';
import { number, object } from 'yup';
import { yup_validate } from '../../../../../../utils/yup_validate';
import { Rating } from 'fsrs.js';
import { update_word } from '../../../../../utils/fsrs';
import { get_stats_by_pack } from '../../../../../../utils/get_stats_by_pack';
import { set_body } from '../../../../../utils/set_body';
import { knex, SYSTEM_PACK_ID } from '../../../../../../constants';
import { Pack, PackLink } from '../../../../../../types/Wokobular';
import { assoc, head, omit } from 'ramda';
import { BadRequest, PermissionDenied } from '../../../../../middlewares/errors';


const schema = object().shape({
    word_id: number().required().integer(),
    pack_id: number().required().integer(),
    student_choice: number().required().oneOf([
        Rating.Again,
        Rating.Hard,
        Rating.Good,
        Rating.Easy
    ] as const)
});

const check_pack = (pack_id: number, word_id: number, student_id: number): Promise<void> =>
    Promise
        .all([
            knex('packs')
                .select('*')
                .where({ id: pack_id })
                .then<Pack | undefined>(head),
            knex('pack_links')
                .select('*')
                .where({ word_id, pack_id })
                .then<PackLink | undefined>(head)
        ])
        .then(([pack, link]) => {
            if (!pack || !link) {
                throw new BadRequest(`Wrong pack_id!`);
            }
            if (![SYSTEM_PACK_ID, student_id].includes(pack.parent_user_id)) {
                throw new PermissionDenied();
            }
        });

export const word_update_M: MiddlewareWithToken = (ctx, next) =>
    yup_validate(schema, ctx.request.body)
        .then(({ word_id, student_choice, pack_id }) =>
            check_pack(pack_id, word_id, ctx.state.student_id)
                .then(() => update_word({
                    word_id,
                    rating: student_choice as Rating,
                    student_id: Number(ctx.state.token.user_id)
                }).then(({ card, word }) => get_stats_by_pack({
                        pack_id,
                        student_id: Number(ctx.state.token.user_id)
                    }).then(stats => ({
                        stats,
                        word: assoc('due', card.due.toISOString(), omit(['insert_id', 'source', 'status'], word))
                    }))
                )))
        .then(set_body(ctx))
        .then(next);

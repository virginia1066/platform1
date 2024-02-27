import { MiddlewareWithToken } from '../../../../../middlewares/check_token_M';
import { number, object } from 'yup';
import { yup_validate } from '../../../../../../utils/yup_validate';
import { Rating } from 'fsrs.js';
import { update_word } from '../../../../../utils/fsrs';
import { get_stats_by_pack } from '../../../../../../utils/get_stats_by_pack';
import { set_body } from '../../../../../utils/set_body';


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

export const word_update_M: MiddlewareWithToken = (ctx, next) =>
    yup_validate(schema, ctx.request.body)
        .then(({ word_id, student_choice, pack_id }) =>
            update_word({
                word_id,
                rating: student_choice as Rating,
                student_id: Number(ctx.state.token.user_id)
            }).then(() => get_stats_by_pack({
                pack_id,
                student_id: Number(ctx.state.token.user_id)
            })))
        .then(set_body(ctx))
        .then(next);

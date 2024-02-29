import { MiddlewareWithToken } from '../../../../../middlewares/check_token_M';
import { number, object } from 'yup';
import { yup_validate } from '../../../../../../utils/yup_validate';
import { knex, SYSTEM_PACK_ID } from '../../../../../../constants';
import { Pack, WordStatus } from '../../../../../../types/Wokobular';
import { head, omit } from 'ramda';
import { NotFound, PermissionDenied } from '../../../../../middlewares/errors';
import { set_body } from '../../../../../utils/set_body';
import { get_stats_by_pack } from '../../../../../../utils/get_stats_by_pack';


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
                    if (![SYSTEM_PACK_ID, Number(ctx.state.token.user_id)].includes(pack.parent_user_id)) {
                        throw new PermissionDenied();
                    }

                    const student_id = ctx.state.token.user_id;

                    return Promise
                        .all([
                            knex('pack_links')
                                .select('pack_links.word_id as id', 'ru', 'en', 'status')
                                .innerJoin('words', 'words.id', 'pack_links.word_id')
                                .leftJoin('learn_cards', function () {
                                    this.on('words.id', 'learn_cards.word_id')
                                        .andOn(knex.raw(`"learn_cards"."student_id" = ${student_id}`));
                                })
                                .where('words.status', WordStatus.Active)
                                .where('pack_id', pack_id)
                                .andWhere(function () {
                                    this.where(knex.raw('CURRENT_TIMESTAMP >= learn_cards.due'))
                                        .orWhereNull('learn_cards.word_id');
                                }),
                            get_stats_by_pack({
                                pack_id: pack_id,
                                student_id: Number(ctx.state.token.user_id)
                            })
                        ])
                        .then(([words, stats]) => Object.assign(
                            Object.create(null),
                            {
                                ...omit(['parent_user_id', 'status'], pack),
                                words,
                                stats
                            })
                        );
                })
        )
        .then(set_body(ctx))
        .then(next);
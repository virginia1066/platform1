import { MiddlewareWithToken } from '../../../../../middlewares/check_token_M';
import { yup_validate } from '../../../../../../utils/yup_validate';
import { object } from 'yup';
import { get_or_create_pack } from '../../../../../../utils/get_or_create_pack';
import { randomUUID } from 'crypto';
import { Word, WordSourcePrefix } from '../../../../../../types/Wokobular';
import { always, assoc } from 'ramda';
import { add_pack_words } from '../../../../../utils/words/add_pack_words';
import { set_body } from '../../../../../utils/set_body';
import { pack_name_create, pack_word, word_status, words } from '../../../../../utils/schemas';

const schema = object().shape({
    name: pack_name_create,
    words: words.clone().of(object().shape({
        ru: pack_word,
        en: pack_word,
        status: word_status,
    }))
});

export const create_pack_M: MiddlewareWithToken = (ctx, next) =>
    yup_validate(schema, ctx.request.body, ctx.state)
        .then(({ name, words }) => {
            const insert_id = randomUUID();

            return get_or_create_pack({
                name,
                user_can_edit: true,
                parent_user_id: ctx.state.student_id,
                insert_id
            }).then(pack => add_pack_words(
                pack,
                words.map<Omit<Word, 'insert_id' | 'id'>>(
                    assoc('source', `${WordSourcePrefix.UserAdd}-${ctx.state.student_id}`)
                ),
                insert_id
            )).then(always({ ok: true }));
        })
        .then(set_body(ctx))
        .then(next);

import { Middleware } from 'koa';
import { yup_validate_sync } from '../../../../../utils/yup_validate';
import { number, object } from 'yup';
import { knex } from '../../../../../constants';

export const replace_mk_id_M: Middleware = (ctx, next) => {
    const { tg_id, mk_id } = yup_validate_sync(object().shape({
        tg_id: number().required().integer(),
        mk_id: number().required().integer()
    }), ctx.request.body);

    return knex('tg_users')
        .update('mk_id', mk_id)
        .where('tg_id', tg_id)
        .then(() => {
            ctx.body = { ok: true };
        })
        .then(next);
};
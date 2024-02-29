import { Middleware } from 'koa';
import { number, object } from 'yup';
import { yup_validate } from '../../../../../utils/yup_validate';
import { knex, MESSAGE_BUS } from '../../../../../constants';
import { HomeTaskWebhook, WebhookHomeTaskStatus } from '../../../../../types/general';
import { head } from 'ramda';
import { set_body } from '../../../../utils/set_body';

const schema = object().shape({
    object: object().required().shape({
        lessonId: number().required().integer()
    })
});

export const on_home_task_update_M: Middleware = (ctx, next) =>
    yup_validate(schema, ctx.request.body)
        .then(({ object: { lessonId } }) => {
            return knex('home_task_webhook')
                .insert({
                    lesson_id: lessonId,
                    status: WebhookHomeTaskStatus.Pending
                })
                .onConflict('lesson_id')
                .merge()
                .returning('*')
                .then<HomeTaskWebhook>(head)
                .then((task) => {
                    MESSAGE_BUS.trigger('home_task_update', task);
                    return { ok: true };
                })
                .then(set_body(ctx))
                .then(next);
        });
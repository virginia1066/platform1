import { Middleware } from 'koa';
import { number, object } from 'yup';
import { yup_validate } from '../../../../../utils/yup_validate';

const schema = object().shape({
    object: object().required().shape({
        lessonId: number().required().integer()
    })
});

export const on_home_task_update_M: Middleware = (ctx, next) =>
    yup_validate(schema, ctx.request.body)
        .then(({ object: { lessonId } }) => {

        });
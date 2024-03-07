import { AnySchema, Schema, ValidationError } from 'yup';
import { BadRequest } from '../server/middlewares/errors';


const get_error = (e: any): BadRequest => {
    if (e instanceof ValidationError) {
        const errorHash = e.inner.reduce(
            (acc, item) =>
                Object.assign(acc, { [item.path ?? item.name]: item.message }),
            Object.create(null)
        );

        return new BadRequest(Object.entries(errorHash).reduce((message, [field, error]) => {
            return `${(message ? message + '\n' : message)}Field "${field}" is invalid. Details: "${error}".`;
        }, ''), errorHash);
    }
    return new BadRequest(e.message);
};

export const yup_validate_sync = <T extends AnySchema<any>>(schema: T, data: any, context?: any) => {
    try {
        return schema.validateSync(data, { abortEarly: false, context });
    } catch (e) {
        throw get_error(e);
    }
};

export const yup_validate = <T>(schema: Schema<T>, data: any, context?: any): Promise<Schema<T>['__outputType']> =>
    schema.validate(data, { abortEarly: false, context })
        .catch((e) => Promise.reject(get_error(e)));
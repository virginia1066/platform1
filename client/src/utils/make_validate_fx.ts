import { Schema, ValidationError } from 'yup';
import { coreD } from '../models/core';
import { Effect } from 'effector';

export function make_validate_fx<T extends { key?: string }>(schema: Schema): Effect<T, boolean, Record<string, string>> {
    return coreD.createEffect<T, boolean, Record<string, string>>((props: T) => {
        const get_error = (e: ValidationError) => e.inner.reduce((acc, error) => {
            return Object.assign(acc, { [error.path!]: error.message });
        }, Object.create(null));

        try {
            schema.validateSync(props, { abortEarly: false });
            return true;
        } catch (e) {
            if (e instanceof ValidationError) {
                const errors = get_error(e);
                if (props.key) {
                    if (errors[props.key]) {
                        throw { [props.key]: errors[props.key]};
                    } else {
                        return true;
                    }
                }
                throw errors;
            } else {
                throw {};
            }
        }
    });
};
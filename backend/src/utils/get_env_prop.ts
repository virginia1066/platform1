import { isNil } from 'ramda';

export const get_env_prop = (name: string): string | undefined => {
    return process.env[name];
};

export const get_env_strict = <U = string>(name: string, processor?: (data: string) => U): U => {
    const value = get_env_prop(name);

    if (isNil(value)) {
        throw new Error(`Env property ${name} is empty! Please check env!`);
    }

    return processor
        ? processor(value)
        : value as U;
};

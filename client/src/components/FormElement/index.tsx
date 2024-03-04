import { FormControl, FormErrorMessage, Input, InputGroup, InputLeftElement, InputProps, InputRightElement } from '@chakra-ui/react';
import { head } from "ramda";
import { ChangeEventHandler, ReactElement, useCallback, useEffect, useId, useState } from "react";
import { Schema, ValidationError } from "yup";
import { Func } from '../../types/utils';


export const FormElement = <T extends string | number>({ default_value, validate, onChange, inputLeftElement = null, inputRightElement = null, input_lenght = undefined, ...props }: Props<T>) => {
    const id = useId();

    const [value, set_value] = useState(default_value);
    const [errors, set_error] = useState<Array<string>>([]);

    const blur = useCallback(() => {
        validate.validate(value)
            .catch((e: ValidationError) => set_error(e.errors));
    }, [validate, value]);

    const focus = useCallback(() => set_error([]), []);

    useEffect(() => {
        if (default_value !== value) {
            set_value(default_value);
        }
    }, [default_value]);


    const change_callback = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
        const value: T = e.target.value as T;
        if (!input_lenght) {
            set_value(value);
            onChange(value);
        } else if (value.toString().length < input_lenght) {
            set_value(value);
            onChange(value);
        }
    }, [onChange]);

    useEffect(() => {
        set_error([]);
    }, [value]);

    return (
        <FormControl isInvalid={!!errors?.length}>
            <InputGroup>
                {
                    inputLeftElement
                        ? <InputLeftElement>{inputLeftElement}</InputLeftElement>
                        : null
                }
                <Input
                    {...props}
                    id={id}
                    value={value}
                    onChange={change_callback}
                    onBlur={blur}
                    onFocus={focus}
                    variant={'tg'}
                    isInvalid={!!errors?.length}
                />
                {
                    inputRightElement
                        ? <InputRightElement>{inputRightElement}</InputRightElement>
                        : null
                }
            </InputGroup>
            <FormErrorMessage>{head(errors ?? [])}</FormErrorMessage>
        </FormControl>
    );
};

type Props<T extends string | number | undefined> = {
    default_value: T;
    validate: Schema<T>;
    inputLeftElement?: ReactElement | null;
    inputRightElement?: ReactElement | null;
    input_lenght?: number;
    onChange: Func<[T], void>;
    borderColor?: string;
} & Omit<Partial<InputProps>, 'id' | 'size' | 'onChange' | 'onBlur' | 'onFocus' | 'variant' | 'isInvalid' | 'value'>;

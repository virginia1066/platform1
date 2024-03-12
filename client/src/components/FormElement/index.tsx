import {
    FormControl,
    FormErrorMessage,
    Input,
    InputGroup,
    InputLeftElement,
    InputProps,
    InputRightElement
} from '@chakra-ui/react';
import { ChangeEventHandler, ReactElement, useCallback, useEffect, useId, useState } from 'react';
import { Func } from '../../types/utils';


export const FormElement = <T extends string | number>({
                                                           default_value,
                                                           error,
                                                           onChange,
                                                           inputLeftElement = null,
                                                           inputRightElement = null,
                                                           input_length = undefined,
                                                           ...props
                                                       }: Props<T>) => {
    const id = useId();

    const [value, set_value] = useState(default_value);

    useEffect(() => {
        if (default_value !== value) {
            set_value(default_value);
        }
    }, [default_value]);


    const change_callback = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
        const value: T = e.target.value as T;
        if (!input_length) {
            set_value(value);
            onChange(value);
        } else if (value.toString().length < input_length) {
            set_value(value);
            onChange(value);
        }
    }, [onChange]);

    return (
        <FormControl isInvalid={!!error}>
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
                    variant={'tg'}
                    isInvalid={!!error}
                />
                {
                    inputRightElement
                        ? <InputRightElement>{inputRightElement}</InputRightElement>
                        : null
                }
            </InputGroup>
            <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
    );
};

type Props<T extends string | number | undefined> = {
    default_value: T;
    inputLeftElement?: ReactElement | null;
    inputRightElement?: ReactElement | null;
    input_length?: number;
    onChange: Func<[T], void>;
    borderColor?: string;
    error?: string | undefined;
} & Omit<Partial<InputProps>, 'id' | 'size' | 'onChange' | 'variant' | 'isInvalid' | 'value'>;

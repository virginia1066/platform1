import { Flex, IconButton } from '@chakra-ui/react';
import { FormElement } from '../../components/FormElement';
import { CloseIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import { delete_word_e, edit_word_e, EditWord, input_blur_e, input_focus_e } from './model';
import { useUnit } from 'effector-react';
import { useCallback } from 'react';
import { Block } from '../../components/Block/inedex';
import { get_triteary_bg_color } from '../../theme/Colors';
import { colorScheme } from '../../theme/defaults';

const TRANS_PROPS = {
    keyPrefix: 'vocabulary.deckEdit'
} as const;

export const WordEdit = ({ word, index, can_remove, errors }: Props) => {
    const { t } = useTranslation('translation', TRANS_PROPS);
    const delete_word = useUnit(delete_word_e);
    const edit_word = useUnit(edit_word_e);
    const [focus, blur] = useUnit([input_focus_e, input_blur_e]);
    const on_delete_click = useCallback(() => delete_word(index), [index]);

    const on_focus_ru = useCallback(() => focus(`words[${index}].ru`), [index, focus]);
    const on_focus_en = useCallback(() => focus(`words[${index}].en`), [index, focus]);

    const on_blur_ru = useCallback(() => blur(`words[${index}].ru`), [index, blur]);
    const on_blur_en = useCallback(() => blur(`words[${index}].en`), [index, blur]);

    const on_change_ru = useCallback((value: string) => {
        edit_word({
            index,
            value,
            lang: 'ru'
        });
    }, [index, edit_word]);

    const on_change_en = useCallback((value: string) => {
        edit_word({
            index,
            value,
            lang: 'en'
        });
    }, [index, edit_word]);


    return (
        <Block bgColor={get_triteary_bg_color(colorScheme)} flexDir={'column'}>
            <Flex w={'full'} gap={4} alignItems={'center'}>
                <Flex direction={'column'} w={'full'} gap={3}>
                    <FormElement placeholder={t('placeholder.lang2')} default_value={word.en}
                        error={errors[`words[${index}].en`]}
                        onFocus={on_focus_en}
                        onBlur={on_blur_en}
                        onChange={on_change_en} />
                    <FormElement placeholder={t('placeholder.lang1')} default_value={word.ru}
                        error={errors[`words[${index}].ru`]}
                        onFocus={on_focus_ru}
                        onBlur={on_blur_ru}
                        onChange={on_change_ru} />
                </Flex>
                <IconButton size={'xs'}
                    onClick={on_delete_click}
                    variant={'delete'}
                    isDisabled={!can_remove}
                    aria-label="Delete"
                    icon={<CloseIcon w={'10px'} h={'10px'} />} />
            </Flex>
        </Block >
    );
};

type Props = {
    errors: Record<string, string>;
    word: EditWord
    index: number;
    can_remove: boolean;
}

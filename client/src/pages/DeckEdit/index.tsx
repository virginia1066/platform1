import { Box, Button, Flex, FormLabel, HStack, IconButton, VStack } from '@chakra-ui/react';
import { ButtonBar } from '../../components/ButtonBar';
import { PageWrap } from '../../components/PageWrap';
import { useTranslation } from 'react-i18next';
import { BackButton } from '../../components/BackButton';
import { BASE_URL } from '../../constants';
import { Block } from '../../components/Block/inedex';
import { get_triteary_bg_color } from '../../theme/Colors';
import { AddIcon } from '@chakra-ui/icons';
import { colorScheme, themeParams } from '../../theme/defaults';
import { FormElement } from '../../components/FormElement';
import { useUnit } from 'effector-react';
import { $errors, $words, add_word_e, change_name_e, input_blur_e, input_focus_e, save_click_e } from './model';
import { WordEdit } from './WordEdit';
import { useCallback } from 'react';

const TRANS_PROPS = {
    keyPrefix: 'vocabulary.deckEdit'
} as const;

export const DeckEdit = () => {
    const { t } = useTranslation('translation', TRANS_PROPS);
    const [
        add_word,
        save_click,
        change_name,
        focus,
        blur
    ] = useUnit([add_word_e, save_click_e, change_name_e, input_focus_e, input_blur_e]);
    const words = useUnit($words);
    const errors = useUnit($errors);
    const on_name_focus = useCallback(() => focus('name'), []);
    const on_name_blur = useCallback(() => blur('name'), []);

    return (
        <PageWrap headerTitle={t('header')}>
            <Flex h={'full'} position={'relative'}>
                <Box position={'absolute'} w={'full'} h={'full'} overflowY={'auto'}>
                    <Block h={'max-content'}>
                        <VStack spacing={4} alignItems={'start'} w={'full'}>
                            <FormLabel m={0}>{t('labelDeckTitle')}</FormLabel>
                            <FormElement placeholder={t('placeholder.title')}
                                default_value={''}
                                onFocus={on_name_focus}
                                onBlur={on_name_blur}
                                error={errors['name']}
                                onChange={change_name} />
                            <VStack spacing={3} alignItems={'start'} w={'full'}>
                                <FormLabel m={0}>{t('labelWords')}</FormLabel>
                                {
                                    words.map((word, i) => (
                                        <WordEdit key={word.id ? `id-${word.id}` : `${word.en}-${word.ru}-${i}`}
                                            errors={errors}
                                            can_remove={words.length !== 1} word={word} index={i} />
                                    ))
                                }
                                <IconButton bgColor={themeParams.button_text_color} color={themeParams.button_color}
                                    onClick={add_word}
                                    borderWidth={'2px'} alignSelf={'center'} variant={'main'} size={'lg'}
                                    aria-label="Add" icon={<AddIcon />} />
                            </VStack>
                        </VStack>
                    </Block>
                </Box>
            </Flex>
            <ButtonBar>
                <HStack spacing={4}>
                    <BackButton url={`${BASE_URL}/`} />
                    <Button onClick={save_click} w={'full'} variant={'main'} size={'lg'}>{t('buttonSave')}</Button>
                </HStack>
            </ButtonBar>
        </PageWrap>
    );
};
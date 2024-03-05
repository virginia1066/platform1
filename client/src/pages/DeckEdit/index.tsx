import { Button, Flex, FormLabel, HStack, IconButton, VStack } from '@chakra-ui/react';
import { ButtonBar } from '../../components/ButtonBar';
import { PageWrap } from '../../components/PageWrap';
import { useTranslation } from 'react-i18next';
import { BackButton } from '../../components/BackButton';
import { BASE_URL } from '../../constants';
import { useCallback } from 'react';
import { Block } from '../../components/Block/inedex';
import { ProgressStats } from '../../components/ProgressStats';
import { get_triteary_bg_color } from '../../theme/Colors';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { colorScheme, themeParams } from '../../theme/defaults';
import { FormElement } from '../../components/FormElement';
import { string } from 'yup';

const TRANS_PROPS = {
    keyPrefix: 'vocabulary.deckEdit'
} as const;

export const DeckEdit = () => {
    const { t } = useTranslation('translation', TRANS_PROPS);

    const validation = string().required(t('required')).max(100, t('max'));

    const handleInputChange = useCallback((e: any) => console.log(e), []);

    return (
        <PageWrap headerTitle={t('header')}>
            <Flex h={'full'}>
                <Block h={'max-content'}>
                    <VStack spacing={4} alignItems={'start'}>
                        <FormElement placeholder={t('placeholder.title')} default_value={''}
                                     onChange={handleInputChange} validate={validation}/>
                        <ProgressStats justifyContent={'space-between'} w={'full'} new_ones={1} repeatable={2}
                                       studied={3} direction={'row'}/>
                        <VStack spacing={3} alignItems={'start'}>
                            <FormLabel m={0}>{t('labelWords')}</FormLabel>
                            <Block bgColor={get_triteary_bg_color(colorScheme)} flexDir={'column'}>
                                <Flex gap={4} alignItems={'center'}>
                                    <Flex direction={'column'} gap={3}>
                                        <FormElement placeholder={t('placeholder.lang1')} default_value={''}
                                                     onChange={handleInputChange} validate={validation}/>
                                        <FormElement placeholder={t('placeholder.lang2')} default_value={''}
                                                     onChange={handleInputChange} validate={validation}/>
                                    </Flex>
                                    <IconButton size={'xs'} variant={'delete'} aria-label="Delete"
                                                icon={<CloseIcon w={'10px'} h={'10px'}/>}/>
                                </Flex>
                            </Block>
                            <IconButton bgColor={themeParams.button_text_color} color={themeParams.button_color}
                                        borderWidth={'2px'} alignSelf={'center'} variant={'main'} size={'lg'}
                                        aria-label="Add" icon={<AddIcon/>}/>
                        </VStack>
                    </VStack>
                </Block>
            </Flex>
            <ButtonBar>
                <HStack spacing={4}>
                    <BackButton url={`${BASE_URL}/`}/>
                    <Button w={'full'} variant={'main'} size={'lg'}>{t('buttonSave')}</Button>
                </HStack>
            </ButtonBar>
        </PageWrap>
    );
};
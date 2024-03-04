import {
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    IconButton,
    Input,
    VStack
} from '@chakra-ui/react';
import { ButtonBar } from '../../components/ButtonBar';
import { PageWrap } from '../../components/PageWrap';
import { useTranslation } from 'react-i18next';
import { BackButton } from '../../components/BackButton';
import { BASE_URL } from '../../constants';
import { ChangeEvent, useCallback, useState } from 'react';
import { Block } from '../../components/Block/inedex';
import { ProgressStats } from '../../components/ProgressStats';
import { get_triteary_bg_color } from '../../theme/Colors';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { colorScheme, themeParams } from '../../theme/defaults';

const TRANS_PROPS = {
    keyPrefix: 'vocabulary.deckEdit'
} as const;

export const DeckEdit = () => {
    const { t } = useTranslation('translation', TRANS_PROPS);
    const [input, setInput] = useState('');
    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value), []);
    const isError = true;

    return (
        <PageWrap headerTitle={t('header')}>
            <Flex h={'full'}>
                <Block h={'max-content'}>
                    <VStack spacing={4} alignItems={'start'}>
                        <FormControl isInvalid={isError}>
                            <FormLabel>{t('labelDeckTitle')}</FormLabel>
                            <Input variant={'tg'} type="email" value={input} onChange={handleInputChange}/>
                            {
                                isError
                                    ? <FormErrorMessage>Email is required.</FormErrorMessage>
                                    : null
                            }
                        </FormControl>
                        <ProgressStats justifyContent={'space-between'} w={'full'} new_ones={1} repeatable={2}
                                       studied={3} direction={'row'}/>
                        <VStack spacing={3} alignItems={'start'}>
                            <FormLabel m={0}>{t('labelWords')}</FormLabel>
                            <Block bgColor={get_triteary_bg_color(colorScheme)} flexDir={'column'}>
                                <Flex gap={4} alignItems={'center'}>
                                    <Flex direction={'column'} gap={3}>
                                        <FormControl isInvalid={isError}>
                                            <Input variant={'tg'} type="email" value={input}
                                                   onChange={handleInputChange}/>
                                            {
                                                isError
                                                    ? <FormErrorMessage>Email is required.</FormErrorMessage>
                                                    : null
                                            }
                                        </FormControl>
                                        <FormControl isInvalid={isError}>
                                            <Input variant={'tg'} type="email" value={input}
                                                   onChange={handleInputChange}/>
                                            {
                                                isError
                                                    ? <FormErrorMessage>Email is required.</FormErrorMessage>
                                                    : null
                                            }
                                        </FormControl>
                                    </Flex>
                                    <IconButton size={'xs'} variant={'delete'} aria-label="Delete"
                                                icon={<CloseIcon w={'10px'} h={'10px'}/>}/>
                                </Flex>
                            </Block>
                            <IconButton bgColor={themeParams.button_text_color} color={themeParams.button_color}
                                        borderWidth={'2px'} alignSelf={'center'} variant={'main'} aria-label="Add"
                                        icon={<AddIcon/>}/>
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
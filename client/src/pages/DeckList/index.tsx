import { useTranslation } from 'react-i18next';
import { Block } from '../../components/Block/inedex';
import { ButtonBar } from '../../components/ButtonBar';
import { Box, Button, ButtonGroup, Flex, Heading, IconButton, Text, VStack } from '@chakra-ui/react';
import { useGate, useList } from 'effector-react';
import { $deckList, DeckListGate } from '../../models/vocabulary';
import { PageWrap } from '../../components/PageWrap';
import { ProgressStats } from '../../components/ProgressStats';
import { useCallback, useState } from 'react';
import { themeParams } from '../../theme/defaults';
import { fontSizes } from '../../theme/constants';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

export const DeckList = () => {
    useGate(DeckListGate);
    const deck_list = useList($deckList, ({ id, name, count_review, count_learning, count_new, count_relearning }) => (
        <Block key={`pack-${id}`}>
            <Box me={'auto'}>
                <Heading as={'h2'} size={'md'}>{name}</Heading>
            </Box>
            <ProgressStats textAlign={'end'} new_ones={count_new} studied={count_learning + count_relearning} repeatable={count_review} />
        </Block>
    ));

    const [isEditMode, setEditMode] = useState<boolean>(false);

    const switchEditMode = useCallback(() => {
        setEditMode(!isEditMode);
    }, [isEditMode])

    const { t } = useTranslation('translation', {
        keyPrefix: 'vocabulary.deckList'
    });

    return (
        <PageWrap headerTitle={t('header')}>
            <Flex direction={'column'}>
                <Box h={'38px'} textAlign={'center'}>
                    {
                        isEditMode
                            ? <Text size={'sm'} lineHeight={fontSizes.sm} color={themeParams.hint_color}>Редактируйте колоды <br /> или управляйте их видимостью.</Text>
                            : null
                    }
                </Box>
                <Box textAlign={'end'}>
                    <Button size={'xs'} variant={'link'} onClick={switchEditMode}>{
                        isEditMode
                            ? 'Назад'
                            : 'Редактировать список'
                    }</Button>
                </Box>
            </Flex>
            <Flex h={'full'} position={'relative'}>
                <Box position={'absolute'} w={'full'} h={'full'} overflowY={'auto'}>
                    <VStack spacing={4} h={'max-content'} justifyContent={'center'}>
                        {/* {deck_list} */}
                        <Block key={`pack-${1}`}>
                            <Box me={'auto'}>
                                <Heading as={'h2'} size={'md'}>{1}</Heading>
                            </Box>
                            <ProgressStats textAlign={'end'} new_ones={3} studied={5 + 4} repeatable={2} />
                        </Block>
                        <Block key={`pack-${2}`}>
                            <Box me={'auto'}>
                                <Heading as={'h2'} size={'md'}>{2}</Heading>
                            </Box>
                            {
                                isEditMode
                                    ? <ButtonGroup isAttached spacing='6' orientation='vertical'>
                                        <IconButton variant={'delete'} colorScheme='red' aria-label='Delete deck' icon={<DeleteIcon />} />
                                        <IconButton variant={'edit'} colorScheme='grey' aria-label='Edit deck' icon={<EditIcon />} />                                        
                                    </ButtonGroup>
                                    : <ProgressStats textAlign={'end'} new_ones={4} studied={5 + 3} repeatable={3} />
                            }
                        </Block>

                    </VStack>
                </Box>
            </Flex>
            <ButtonBar>
                <>
                    <Button w={'full'} variant={'main'} size={'lg'}>{t('button')}</Button>
                </>
            </ButtonBar>
        </PageWrap>
    );
};

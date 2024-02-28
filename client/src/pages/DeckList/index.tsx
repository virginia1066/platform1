import { useTranslation } from 'react-i18next';
import { ButtonBar } from '../../components/ButtonBar';
import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react';
import { useGate, useList, useUnit } from 'effector-react';
import { $deckListC, $editMode, DeckListGate, setEditModeE } from '../../models/vocabulary';
import { PageWrap } from '../../components/PageWrap';
import { useCallback } from 'react';
import { themeParams } from '../../theme/defaults';
import { fontSizes } from '../../theme/constants';
import { ListItem } from '../Deck/components/ListItem';


export const DeckList = () => {
    useGate(DeckListGate);

    const [setEditMode, editMode] = useUnit([setEditModeE, $editMode]);

    const deck_list = useList($deckListC, ({
                                               id,
                                               editMode,
                                               name,
                                               count_review,
                                               count_learning,
                                               count_new,
                                               count_relearning
                                           }) => (
        <ListItem key={`deck-${id}`} isEditMode={editMode}
                  name={name}
                  count_learning={count_learning}
                  count_relearning={count_relearning}
                  count_review={count_review}
                  count_new={count_new}/>
    ));

    const switchEditMode = useCallback(() => {
        setEditMode(!editMode);
    }, [editMode]);

    const { t } = useTranslation('translation', {
        keyPrefix: 'vocabulary.deckList'
    });

    return (
        <PageWrap headerTitle={t('header')}>
            <Flex direction={'column'}>
                <Box h={'38px'} textAlign={'center'}>
                    {
                        editMode
                            ? <Text size={'sm'} lineHeight={fontSizes.sm} color={themeParams.hint_color}>Редактируйте
                                колоды <br/> или управляйте их видимостью.</Text>
                            : null
                    }
                </Box>
                <Box textAlign={'end'}>
                    <Button size={'xs'} variant={'link'} onClick={switchEditMode}>{
                        editMode
                            ? 'Назад'
                            : 'Редактировать список'
                    }</Button>
                </Box>
            </Flex>
            <Flex h={'full'} position={'relative'}>
                <Box position={'absolute'} w={'full'} h={'full'} overflowY={'auto'}>
                    <VStack spacing={4} h={'max-content'} justifyContent={'center'}>
                        {
                            deck_list
                        }
                    </VStack>
                </Box>
            </Flex>
            <ButtonBar>
                {
                    editMode
                        ? <Button w={'full'} variant={'main'} size={'lg'}>{t('buttonSave')}</Button>
                        : <Button w={'full'} variant={'main'} size={'lg'}>{t('buttonCreate')}</Button>
                }
            </ButtonBar>
        </PageWrap>
    );
};

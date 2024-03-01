import { Trans, useTranslation } from 'react-i18next';
import { ButtonBar } from '../../components/ButtonBar';
import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react';
import { useGate, useList, useUnit } from 'effector-react';
import { $deckListC, $editMode, DeckListGate, setEditModeE } from '../../models/vocabulary';
import { PageWrap } from '../../components/PageWrap';
import { useCallback } from 'react';
import { themeParams } from '../../theme/defaults';
import { fontSizes } from '../../theme/constants';
import { ListItem } from './components/ListItem';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../utils/constants';


export const DeckList = () => {
    useGate(DeckListGate);

    const [setEditMode, editMode] = useUnit([setEditModeE, $editMode]);

    const navigate = useNavigate()

    const deck_list = useList($deckListC, (props) => (
        <ListItem key={`deck-${props.id}`} {...props}/>
    ));

    const switchEditMode = useCallback(() => {
        setEditMode(!editMode);
    }, [editMode]);

    const gotoCreate = useCallback(() => {
        navigate(`${BASE_URL}/edit`)
    },[navigate])

    const { t } = useTranslation('translation', {
        keyPrefix: 'vocabulary.deckList'
    });

    return (
        <PageWrap headerTitle={t('header')}>
            <Flex direction={'column'}>
                <Box h={'38px'} textAlign={'center'}>
                    {
                        editMode
                            ? <Text size={'sm'} color={themeParams.hint_color}><Trans t={t} i18nKey={'subtitleEdit'}/></Text>
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
                        : <Button w={'full'} variant={'main'} onClick={gotoCreate} size={'lg'}>{t('buttonCreate')}</Button>
                }
            </ButtonBar>
        </PageWrap>
    );
};

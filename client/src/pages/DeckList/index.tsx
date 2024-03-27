import { Trans, useTranslation } from 'react-i18next';
import { ButtonBar } from '../../components/ButtonBar';
import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react';
import { useGate, useList, useUnit } from 'effector-react';
import {
    $deckListC,
    $editMode,
    cancelEditModeE,
    DeckListGate,
    enableEditModeE,
    fetchDeckListFx,
    saveSkipListE
} from './model';
import { PageWrap } from '../../components/PageWrap';
import { useCallback } from 'react';
import { themeParams } from '../../theme/defaults';
import { ListItem } from './components/ListItem';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../constants';

const TRANS_OPTIONS = {
    keyPrefix: 'vocabulary.deckList'
} as const;

export const DeckList = () => {
    useGate(DeckListGate);

    const [
        enableEditMode,
        cancelEditMode,
        saveSkipList,
        editMode,
    ] = useUnit([enableEditModeE, cancelEditModeE, saveSkipListE, $editMode]);

    const navigate: (to: string) => void = useNavigate();

    const deck_list = useList($deckListC, (props) => (
        <ListItem key={`deck-${props.id}`} {...props} />
    ));

    const is_pending = useUnit(fetchDeckListFx.pending);

    const switchEditMode = useCallback(() =>
            editMode
                ? cancelEditMode()
                : enableEditMode()
        , [editMode, cancelEditMode, enableEditMode]
    );
    const goto_create = useCallback(() => navigate(`${BASE_URL}/edit/new`), [navigate]);
    const { t } = useTranslation('translation', TRANS_OPTIONS);

    return (
        <PageWrap headerTitle={t('header')}>
            <Flex direction={'column'}>
                <Box h={'38px'} textAlign={'center'}>
                    {
                        editMode
                            ? (
                                <Text size={'sm'} color={themeParams.hint_color}>
                                    <Trans t={t} i18nKey={'subtitleEdit'}/>
                                </Text>
                            )
                            : null
                    }
                </Box>
                <Box textAlign={'end'}>
                    <Button size={'xs'} variant={'link'} onClick={switchEditMode}>{
                        editMode
                            ? t('backLink')
                            : t('editLink')
                    }</Button>
                </Box>
            </Flex>
            <Flex h={'full'} position={'relative'}>
                <Box position={'absolute'} w={'-webkit-fill-available'} h={'full'} overflowY={'auto'}>
                    <VStack spacing={4} h={'max-content'} justifyContent={'center'} opacity={0}
                            animation={is_pending ? 'none' : 'fadeIn 500ms forwards'}>
                        {
                            deck_list
                        }
                    </VStack>
                </Box>
            </Flex>
            <ButtonBar>
                {
                    editMode
                        ? <Button w={'full'} variant={'main'} onClick={saveSkipList}
                                  size={'lg'}>{t('buttonSave')}</Button>
                        : <Button w={'full'} variant={'main'} onClick={goto_create}
                                  size={'lg'}>{t('buttonCreate')}</Button>
                }
            </ButtonBar>
        </PageWrap>
    );
};

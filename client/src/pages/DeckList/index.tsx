import { useTranslation } from 'react-i18next';
import { ButtonBar } from '../../components/ButtonBar';
import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react';
import { useGate, useList, useUnit } from 'effector-react';
import { $deckListC, $editMode, DeckListGate, setEditModeE } from './model';
import { PageWrap } from '../../components/PageWrap';
import { useCallback } from 'react';
import { themeParams } from '../../theme/defaults';
import { fontSizes } from '../../theme/constants';
import { ListItem } from './components/ListItem';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../constants';
import { always, not, pipe } from 'ramda';

const TRANS_OPTIONS = {
    keyPrefix: 'vocabulary.deckList'
} as const;

export const DeckList = () => {
    useGate(DeckListGate);

    const [setEditMode, editMode] = useUnit([setEditModeE, $editMode]);
    const navigate: (to: string) => void = useNavigate();

    const deck_list = useList($deckListC, (props) => (
        <ListItem key={`deck-${props.id}`} {...props}/>
    ));

    const switchEditMode = useCallback(pipe(always(editMode), not, setEditMode), [editMode]);
    const gotoCreate = useCallback(pipe(always(`${BASE_URL}/edit`), navigate), [navigate]);
    const { t } = useTranslation('translation', TRANS_OPTIONS);

    return (
        <PageWrap headerTitle={t('header')}>
            <Flex direction={'column'}>
                <Box h={'38px'} textAlign={'center'}>
                    {
                        editMode
                            ? (
                                <Text size={'sm'} lineHeight={fontSizes.sm} color={themeParams.hint_color}>
                                    Редактируйте {/*TODO translate*/}
                                    колоды <br/> или управляйте их видимостью.
                                </Text>
                            )
                            : null
                    }
                </Box>
                <Box textAlign={'end'}>
                    <Button size={'xs'} variant={'link'} onClick={switchEditMode}>{
                        editMode
                            ? 'Назад' /*TODO translate*/
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
                        : <Button w={'full'} variant={'main'} onClick={gotoCreate}
                                  size={'lg'}>{t('buttonCreate')}</Button>
                }
            </ButtonBar>
        </PageWrap>
    );
};

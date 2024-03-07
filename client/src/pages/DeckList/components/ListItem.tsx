import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, Checkbox, Flex, Heading, HStack } from '@chakra-ui/react';
import { Block } from '../../../components/Block/inedex';
import { ProgressStats } from '../../../components/ProgressStats';
import { colorScheme, themeParams } from '../../../theme/defaults';
import { Colors, get_triteary_bg_color } from '../../../theme/Colors';
import { ChangeEvent, FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../constants';
import { BlockLabel } from '../../../components/Block/BlockLabel';
import { DeckItemShort } from '../../../types/vocabulary';
import { useUnit } from 'effector-react';
import { $tmpDeckList, changeSkipList, deleteDeckE } from '../model';
import { useTranslation } from 'react-i18next';

export const ListItem: FC<DeckListItem> = ({
                                               editMode,
                                               id,
                                               name,
                                               user_can_edit,
                                               stats: {
                                                   count_can_be_shown,
                                                   count_new,
                                                   count_review,
                                                   count_learning,
                                                   count_relearning,
                                               },
                                           }) => {

    const [onChange, skipList] = useUnit([changeSkipList, $tmpDeckList]);
    const navigate = useNavigate();
    const gotoDeck = useCallback(() => navigate(`${BASE_URL}/deck/${id}`), [id, navigate]);
    const isActive = count_can_be_shown > 0 && !editMode;
    const isChecked = !skipList.includes(id);
    const delete_pack = useUnit(deleteDeckE);
    const on_delete_click = useCallback(() => delete_pack(id), [id]);

    const onChangeChecked = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        onChange({
            id,
            checked
        });
    }, [id, onChange]);

    const { t } = useTranslation('translation', {
        keyPrefix: 'vocabulary.deckList'
    });

    const goto_edit = useCallback(() => navigate(`${BASE_URL}/edit/${id}`), [id]);

    return (
        <Block minH={'106px'}
               onClick={isActive ? gotoDeck : undefined}
               cursor={isActive ? 'pointer' : 'auto'}
               opacity={count_can_be_shown === 0 && !editMode ? 0.6 : 1}>
            {
                count_can_be_shown === 0
                    ? <BlockLabel text={t('labelDone')} color={Colors.green}/> /*TODO translate*/
                    : null
            }
            <HStack spacing={4} me={editMode ? '55px' : 'auto'}>
                {
                    editMode
                        ? <Checkbox onChange={onChangeChecked}
                                    defaultChecked={isChecked}
                                    variant={'tg'}/>
                        : null
                }
                <Heading as={'h2'} size={'md'}>{name}</Heading>
            </HStack>
            {
                editMode && user_can_edit
                    ? <Box position={'absolute'} h={'full'} w={'55px'} right={0} borderRightRadius={8}>
                        <Flex h={'50%'} bgColor={Colors.red} justifyContent={'center'}
                              alignItems={'center'}>
                            <DeleteIcon onClick={on_delete_click}
                                        color={themeParams.button_text_color} mx={'auto'}/>
                        </Flex>
                        <Flex h={'50%'} bgColor={get_triteary_bg_color(colorScheme)} justifyContent={'center'}
                              alignItems={'center'}>
                            <EditIcon onClick={goto_edit} color={themeParams.hint_color}/>
                        </Flex>
                    </Box>
                    : !editMode
                        ? <ProgressStats textAlign={'end'}
                                         new_ones={count_new}
                                         studied={count_learning + count_relearning}
                                         repeatable={count_review}/>
                        : null
            }
        </Block>
    );
};

type DeckListItem = DeckItemShort & { editMode: boolean };
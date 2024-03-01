import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, Checkbox, Flex, Heading, HStack } from '@chakra-ui/react';
import { Block } from '../../../components/Block/inedex';
import { ProgressStats } from '../../../components/ProgressStats';
import { themeParams } from '../../../theme/defaults';
import { Colors } from '../../../theme/Colors';
import { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../constants';
import { BlockLabel } from '../../../components/Block/BlockLabel';
import { DeckItemShort } from '../../../types/vocabulary';
import { always, pipe } from 'ramda';
import { Func } from '../../../types/utils';

export const ListItem: FC<DeckListItem> = ({
                                               editMode,
                                               id,
                                               name,
                                               user_can_edit,
                                               stats: {
                                                   count_new,
                                                   count_review,
                                                   count_learning,
                                                   count_relearning,
                                                   count_can_be_shown
                                               },
                                           }) => {

    const navigate: Func<[string], void> = useNavigate();
    const gotoDeck = useCallback(pipe(always(`${BASE_URL}/deck/${id}`), navigate), [id]);
    const isActive = count_can_be_shown > 0 && !editMode;

    return (
        <Block minH={'114px'} onClick={isActive ? gotoDeck : undefined} cursor={isActive ? 'pointer' : 'auto'}
               opacity={count_can_be_shown === 0 && !editMode ? 0.6 : 1}>
            {
                count_can_be_shown === 0
                    ? <BlockLabel text="Сделано" color={Colors.green[500]}/> /*TODO translate*/
                    : null
            }
            <HStack spacing={4} me={editMode ? '55px' : 'auto'}>
                {
                    editMode
                        ? <Checkbox variant={'tg'}/>
                        : null
                }
                <Heading as={'h2'} size={'md'}>{name}</Heading>
            </HStack>
            {
                editMode && user_can_edit
                    ? <Box position={'absolute'} h={'full'} w={'55px'} right={0} borderRightRadius={8}>
                        <Flex h={'50%'} bgColor={Colors.red[500]} justifyContent={'center'}
                              alignItems={'center'}><DeleteIcon color={themeParams.button_text_color} mx={'auto'}/></Flex>
                        <Flex h={'50%'} bgColor={Colors.triteary_bg_color[500]} justifyContent={'center'}
                              alignItems={'center'}><EditIcon color={themeParams.hint_color}/></Flex>
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
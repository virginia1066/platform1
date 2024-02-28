import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { HStack, Checkbox, Heading, Flex, Box } from "@chakra-ui/react";
import { Block } from "../../../components/Block/inedex";
import { ProgressStats } from "../../../components/ProgressStats";
import { themeParams } from "../../../theme/defaults";
import { Colors } from "../../../theme/Colors";
import { DeckItem } from "../../../models/vocabulary/dictionary";
import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../utils/constants";
import { BlockLabel } from "../../../components/Block/BlockLabel";

export const ListItem: FC<DeckListItem> = ({ editMode, id, name, count_new, count_review, count_learning, count_relearning, count_can_be_shown }) => {

    const navigate = useNavigate();

    const gotoDeck = useCallback(() => {
        navigate(`${BASE_URL}/deck/${id}`)
    }, [id])

    const isActive = count_can_be_shown > 0 && !editMode

    return (
        <Block minH={'114px'} onClick={isActive ? gotoDeck : undefined} cursor={isActive ? 'pointer' : 'auto'} opacity={isActive ? 1 : 0.6}>
            {
                count_can_be_shown === 0
                    ? <BlockLabel text="Сделано" color={Colors.green[500]} />
                    : null
            }
            <HStack spacing={4} me={editMode ? '55px' : 'auto'}>
                {
                    editMode
                        ? <Checkbox variant={'tg'} />
                        : null
                }
                <Heading as={'h2'} size={'md'}>{name}</Heading>
            </HStack>
            {
                editMode
                    ? <Box position={'absolute'} h={'full'} w={'55px'} right={0} borderRightRadius={8}>
                        <Flex h={'50%'} bgColor={Colors.red[500]} justifyContent={'center'} alignItems={'center'}><DeleteIcon color={themeParams.button_text_color} mx={'auto'} /></Flex>
                        <Flex h={'50%'} bgColor={Colors.triteary_bg_color[500]} justifyContent={'center'} alignItems={'center'}><EditIcon color={themeParams.hint_color} /></Flex>
                    </Box>
                    : <ProgressStats textAlign={'end'} new_ones={count_new} studied={count_learning + count_relearning} repeatable={count_review} />
            }
        </Block>
    )
}

type DeckListItem = DeckItem & { editMode: boolean };
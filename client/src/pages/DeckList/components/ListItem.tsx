import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { HStack, Checkbox, Heading, Flex, Box } from "@chakra-ui/react";
import { Block } from "../../../components/Block/inedex";
import { ProgressStats } from "../../../components/ProgressStats";
import { colorScheme, themeParams } from "../../../theme/defaults";
import { Colors, get_triteary_bg_color } from "../../../theme/Colors";
import { DeckItem } from "../../../models/vocabulary/dictionary";
import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../utils/constants";
import { BlockLabel } from "../../../components/Block/BlockLabel";
import { useTranslation } from "react-i18next";

export const ListItem: FC<DeckListItem> = ({ editMode, id, name, count_new, count_review, count_learning, count_relearning, count_can_be_shown }) => {

    const navigate = useNavigate();

    const gotoDeck = useCallback(() => {
        navigate(`${BASE_URL}/deck/${id}`)
    }, [id])

    const { t } = useTranslation('translation', {
        keyPrefix: 'vocabulary.deckList'
    });

    const isEditable = false // user_can_edit

    const isActive = count_can_be_shown > 0 && !editMode

    return (
        <Block minH={'106px'}
            onClick={isActive ? gotoDeck : undefined}
            cursor={isActive ? 'pointer' : 'auto'}
            opacity={count_can_be_shown === 0 && !editMode ? 0.6 : 1}>
            {
                count_can_be_shown === 0
                    ? <BlockLabel text={t('labelDone')} color={Colors.green} />
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
                        <Flex h={'50%'} bgColor={Colors.red} justifyContent={'center'} alignItems={'center'}><DeleteIcon color={themeParams.button_text_color} mx={'auto'} /></Flex>
                        <Flex h={'50%'} bgColor={get_triteary_bg_color(colorScheme)} justifyContent={'center'} alignItems={'center'}><EditIcon color={themeParams.hint_color} /></Flex>
                    </Box>
                    : <ProgressStats textAlign={'end'} new_ones={count_new} studied={count_learning + count_relearning} repeatable={count_review} />
            }
        </Block>
    )
}

type DeckListItem = DeckItem & { editMode: boolean };
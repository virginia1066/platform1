import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { HStack, Checkbox, Heading, Flex, Box } from "@chakra-ui/react";
import { Block } from "../../../components/Block/inedex";
import { ProgressStats } from "../../../components/ProgressStats";
import { themeParams } from "../../../theme/defaults";
import { Colors } from "../../../theme/Colors";
import { DeckItem } from "../../../models/vocabulary/dictionary";
import { FC } from "react";

export const ListItem:FC<DeckListItem> = ({isEditMode, name, count_new, count_review, count_learning, count_relearning}) => (
    <Block minH={'114px'}>
        <HStack spacing={4} me={isEditMode ? '55px' : 'auto'}>
            {
                isEditMode
                    ? <Checkbox variant={'tg'} />
                    : null
            }
            <Heading as={'h2'} size={'md'}>{name}</Heading>
        </HStack>
        {
            isEditMode
                ? <Box position={'absolute'} h={'full'} w={'55px'} right={0} borderRightRadius={8}>
                    <Flex h={'50%'} bgColor={Colors.red[500]} justifyContent={'center'} alignItems={'center'}><DeleteIcon color={themeParams.button_text_color} mx={'auto'} /></Flex>
                    <Flex h={'50%'} bgColor={Colors.triteary_bg_color[500]} justifyContent={'center'} alignItems={'center'}><EditIcon color={themeParams.hint_color} /></Flex>
                </Box>
                : <ProgressStats textAlign={'end'} new_ones={count_new} studied={count_learning + count_relearning} repeatable={count_review} />
        }
    </Block>
)

type DeckListItem = {
    isEditMode : boolean
} & Pick<DeckItem, 'name' | 'count_new' | 'count_learning' | 'count_review' | 'count_relearning'>;
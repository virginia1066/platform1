import { Heading, VStack, Text } from "@chakra-ui/react";
import { Block } from "../../../components/Block/inedex";
import { FC } from "react";
import { themeParams } from "../../../theme/defaults";

export const Word: FC<{ showTranslate: boolean, word: string, translate: string }> = ({ showTranslate, word, translate }) => (
    <Block justifyContent={'center'} h={'fit-content'}>
        <VStack spacing={3}>
            <Heading size={'md'}>{word}</Heading>
            {
                showTranslate
                    ? <Text color={themeParams.hint_color}>{translate}</Text>
                    : null}
        </VStack>

    </Block>
)
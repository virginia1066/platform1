import { Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { Block } from "../../components/Block/inedex";
import { Colors } from "../../theme/Colors";
import { themeParams } from "../../theme/defaults";
import { useTranslation, Trans } from "react-i18next";

export const Error403 = () => {

    const { t } = useTranslation('translation', {
        keyPrefix: 'vocabulary.403'
    });

    const TG_BOT_NAME = 'BeoWulfSchool' // TODO взять из env
    const TG_ADMIN_NAME = '@admin'  // TODO взять из env

    return (
        <Flex h={'full'}
            gap={3}
            justifyContent={'center'}
            flexDir={'column'}>
            <Block>
                <VStack spacing={7}>
                    <Heading color={Colors.red[500]} size={'xxl'}>403</Heading>
                    <VStack textAlign={'center'} spacing={4}>
                        <Text color={themeParams.hint_color}>
                            <Trans t={t} i18nKey={'text'} tOptions={{TG_BOT_NAME, TG_ADMIN_NAME, interpolation: { escapeValue: false }}}/>
                        </Text>
                    </VStack>
                </VStack>
            </Block>
        </Flex>
    );
}
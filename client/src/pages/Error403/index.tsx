import { Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { Block } from "../../components/Block/inedex";
import { Colors } from "../../theme/Colors";
import { themeParams } from "../../theme/defaults";

export const Error403 = () => {

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
                            Доступ запрещен.
                        </Text>
                        <Text color={themeParams.hint_color}>
                            Эта страница доступна только через телеграм бота https://t.me/ 
                            {/* TODO: дописать ссылку */}
                        </Text>
                        <Text color={themeParams.hint_color}>
                            Для доступа к этой странице вам нужно быть клиентом школы Virginia Beowulf.
                        </Text>
                        <Text color={themeParams.hint_color}>
                            Что бы стать клиентом, обратитесь к @admin
                            {/* TODO: дописать ссылку */}
                        </Text>
                    </VStack>
                </VStack>

            </Block>


        </Flex>
    );
}
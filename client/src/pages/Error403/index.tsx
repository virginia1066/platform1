import { Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { Block } from '../../components/Block/inedex';
import { Colors } from '../../theme/Colors';
import { themeParams } from '../../theme/defaults';
import { Trans, useTranslation } from 'react-i18next';
import { TG_BOT_NAME, TG_MK_ADMIN_USER } from '../../constants';

const TRANS_PROPS = {
    keyPrefix: 'vocabulary.403'
} as const;

const T_OPTIONS_PROPS = {
    TG_BOT_NAME,
    TG_MK_ADMIN_USER,
    interpolation: { escapeValue: false }
} as const;

export const Error403 = () => {
    const { t } = useTranslation('translation', TRANS_PROPS);

    return (
        <Flex h={'full'}
              gap={3}
              justifyContent={'center'}
              flexDir={'column'}>
            <Block>
                <VStack spacing={7}>
                    <Heading color={Colors.red} size={'xxl'}>403</Heading>
                    <VStack textAlign={'center'} spacing={4}>
                        <Text color={themeParams.hint_color}>
                            <Trans t={t} i18nKey={'text'}
                                   tOptions={T_OPTIONS_PROPS}>
                                <a href={`https://t.me/${TG_BOT_NAME}`}>https://t.me/{TG_BOT_NAME}</a>
                                <a href={`https://t.me/${TG_MK_ADMIN_USER}`}>@{TG_MK_ADMIN_USER}</a>
                            </Trans>
                        </Text>
                    </VStack>
                </VStack>
            </Block>
        </Flex>
    );
};
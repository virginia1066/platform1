import { Badge, Stack, StackProps, Text } from "@chakra-ui/react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { fontSizes } from "../../theme/constants";

export const ProgressStats:FC<ProgressStatsType> = ({new_ones, studied, repeatable, ...stackProps}) => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'vocabulary'
    });
    return (
        <Stack direction={'column'} spacing={3} {...stackProps}>
            <Text size={'xs'} lineHeight={fontSizes.md} whiteSpace={'nowrap'}>{t('new')} <Badge colorScheme="blue">{new_ones}</Badge></Text>
            <Text size={'xs'} lineHeight={fontSizes.md} whiteSpace={'nowrap'}>{t('studied')} <Badge colorScheme={'teal'}>{studied}</Badge></Text>
            <Text size={'xs'} lineHeight={fontSizes.md} whiteSpace={'nowrap'}>{t('repeatable')} <Badge colorScheme={'green'}>{repeatable}</Badge></Text>
        </Stack>
    )
}

type ProgressStatsType = StackProps & {
    new_ones: number,
    studied: number,
    repeatable: number,
}
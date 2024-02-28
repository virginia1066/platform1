import { Button, Flex, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { ButtonBar } from "../../components/ButtonBar";
import { PageWrap } from "../../components/PageWrap";
import { Block } from "../../components/Block/inedex";
import { ProgressStats } from "../../components/ProgressStats";

export const Deck = () => {
    const { t } = useTranslation('translation', {
        keyPrefix: 'vocabulary.deck'
    });

    return (
        <PageWrap headerTitle={"Название колоды"}>
            <Block><ProgressStats new_ones={12} studied={0} repeatable={176} direction={'row'} /></Block>
            <Flex h={'full'} alignItems={'center'}>
                <Block justifyContent={'center'} h={'fit-content'}>
                    <Heading size={'md'}>Winter is comming</Heading>
                </Block>
            </Flex>

            <ButtonBar>
                <>
                    <Button w={'full'} variant={'main'} size={'lg'}>{t('buttonTranslate')}</Button>
                </>
            </ButtonBar>
        </PageWrap>
    )
}
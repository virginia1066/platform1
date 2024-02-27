import { Button, Flex } from "@chakra-ui/react"
import { ButtonBar } from "../../components/ButtonBar"
import { PageWrap } from "../../components/PageWrap"
import { useTranslation } from "react-i18next"

export const DeckEdit = () => {

    const { t } = useTranslation('translation', {
        keyPrefix: 'vocabulary.deckEdit'
    });

    return (
        <PageWrap headerTitle={t('header')}>
            <Flex h={'full'}>

            </Flex>
            <ButtonBar>
                <>
                    <Button w={'full'} variant={'main'} size={'lg'}>{t('button')}</Button>
                </>
            </ButtonBar>
        </PageWrap>
    )
}
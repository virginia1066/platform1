import { Button, Flex, HStack, Heading, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { ButtonBar } from "../../components/ButtonBar";
import { PageWrap } from "../../components/PageWrap";
import { Block } from "../../components/Block/inedex";
import { ProgressStats } from "../../components/ProgressStats";
import { useCallback, useState } from "react";
import { Word } from "./components/Word";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../utils/constants";
import { BackButton } from "../../components/BackButton";

export const Deck = () => {

    const { t } = useTranslation('translation', {
        keyPrefix: 'vocabulary.deck'
    });

    const navigate = useNavigate()

    const { deckId } = useParams<{ deckId: string }>();

    const [isAnswer, setAnswer] = useState(false);

    const showAnswer = useCallback(() => {
        setAnswer(true)
    }, [])

    return (
        <PageWrap headerTitle={"Название колоды"}>
            <Block minH={'54px'} justifyContent={'center'}>
                <ProgressStats new_ones={12} studied={0} repeatable={176} direction={{ base: 'column', xs: 'row' }}/>
            </Block>
            <Flex h={'full'} alignItems={'center'}>
                <Word showTranslate={isAnswer} word="Winter is Comming" translate="Зима близко" />
            </Flex>

            <ButtonBar>
                <>
                    {
                        isAnswer
                            ? <VStack spacing={4}>
                                <Button w={'full'} colorScheme="blue" variant={'color'} size={'md'}>{t('anki.buttonAgain')}</Button>
                                <Button w={'full'} colorScheme="teal" variant={'color'} size={'md'}>{t('anki.buttonHard')}</Button>
                                <Button w={'full'} colorScheme="teal" variant={'color'} size={'md'}>{t('anki.buttonGood')}</Button>
                                <Button w={'full'} colorScheme="green" variant={'color'} size={'md'}>{t('anki.buttonEasy')}</Button>
                            </VStack>
                            : <HStack spacing={4}>
                                <BackButton url={`${BASE_URL}/`}/>
                                <Button onClick={showAnswer} w={'full'} variant={'main'} size={'lg'}>{t('buttonTranslate')}</Button>
                            </HStack>
                    }
                </>
            </ButtonBar>
        </PageWrap>
    )
}
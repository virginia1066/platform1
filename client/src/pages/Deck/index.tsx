import { Button, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { ButtonBar } from '../../components/ButtonBar';
import { PageWrap } from '../../components/PageWrap';
import { Block } from '../../components/Block/inedex';
import { ProgressStats } from '../../components/ProgressStats';
import { useCallback } from 'react';
import { Word } from './components/Word';
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from '../../constants';
import { BackButton } from '../../components/BackButton';
import { useGate } from 'effector-react';
import {
    $count_learning,
    $count_new,
    $count_review,
    $is_finish,
    $pack_name,
    $translate_shown,
    $words_collection,
    DeckG,
    get_pack_fx,
    set_again,
    set_easy,
    set_good,
    set_hard,
    show_translate
} from './model';
import { useUnit } from 'effector-react/effector-react.umd';
import { themeParams } from '../../theme/defaults';

const TRANS_PROPS = {
    keyPrefix: 'vocabulary.deck'
} as const;

export const Deck = () => {
    const deckId = Number(useParams<{ deckId: string }>().deckId);
    const navigate = useNavigate();
    useGate(DeckG, deckId);

    const { t } = useTranslation('translation', TRANS_PROPS);

    const [
        is_pending,
        name,
        count_new,
        count_learning,
        count_review,
        words_collection,
        translate_shown,
        is_finish
    ] = useUnit([
        get_pack_fx.pending,
        $pack_name,
        $count_new,
        $count_learning,
        $count_review,
        $words_collection,
        $translate_shown,
        $is_finish
    ]);

    const [
        again_click,
        hard_click,
        good_click,
        easy_click,
        show_translate_click
    ] = useUnit([
        set_again,
        set_hard,
        set_good,
        set_easy,
        show_translate
    ]);

    const go_back = useCallback(() => navigate(`${BASE_URL}/`), [navigate]);

    if (isNaN(deckId)) {
        navigate(`${BASE_URL}/`);
    }

    if (!words_collection) {
        return null;
    }

    return (
        <PageWrap headerTitle={name} opacity={0} animation={is_pending ? 'none' : 'fadeIn 500ms forwards'}>
            <Block minH={'54px'} justifyContent={'center'}>
                <ProgressStats new_ones={count_new}
                               studied={count_learning}
                               repeatable={count_review}
                               justifyContent={'space-between'}
                               w={'full'}
                               direction={{ base: 'column', xs: 'row' }}/>
            </Block>

            <Flex h={'full'} alignItems={'center'}>
                {
                    is_finish
                        ? <Word showTranslate={true} word={t('finished.title')} translate={t('finished.text')}/>
                        : <Word showTranslate={translate_shown}
                                word={words_collection?.active_word?.en ?? ''}
                                translate={words_collection?.active_word?.ru ?? ''}/>
                }
            </Flex>

            <ButtonBar>
                {
                    is_finish
                        ? <Button onClick={go_back} w={'full'} variant={'main'}
                                  size={'lg'}>{t('buttonBack')}</Button>
                        : translate_shown
                            ? <VStack spacing={4}>
                                <Text size={'xs'} color={themeParams.hint_color}>{t('anki.hint')}</Text>
                                <Button onClick={again_click} w={'full'} colorScheme="blue" variant={'color'}
                                        size={'md'}>{t('anki.buttonAgain')}</Button>
                                <Button onClick={hard_click} w={'full'} colorScheme="purple" variant={'color'}
                                        size={'md'}>{t('anki.buttonHard')}</Button>
                                <Button onClick={good_click} w={'full'} colorScheme="purple" variant={'color'}
                                        size={'md'}>{t('anki.buttonGood')}</Button>
                                <Button onClick={easy_click} w={'full'} colorScheme="green" variant={'color'}
                                        size={'md'}>{t('anki.buttonEasy')}</Button>
                            </VStack>
                            : <HStack spacing={4}>
                                <BackButton url={`${BASE_URL}/`}/>
                                <Button onClick={show_translate_click} w={'full'} variant={'main'}
                                        size={'lg'}>{t('buttonTranslate')}</Button>
                            </HStack>
                }
            </ButtonBar>
        </PageWrap>
    );
};
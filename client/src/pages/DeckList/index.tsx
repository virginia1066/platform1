import { useTranslation } from 'react-i18next';
import { Block } from '../../components/Block/inedex';
import { ButtonBar } from '../../components/ButtonBar';
import { Header } from '../../components/Header';
import { Box, Button, Flex } from '@chakra-ui/react';
import { useGate, useList } from 'effector-react';
import { $deckList, DeckListGate } from '../../models/vocabulary';

export const DeckList = () => {
    useGate(DeckListGate);
    const deck_list = useList($deckList, ({ id, name, count_review, count_learning, count_new, count_relearning }) => (
        <Box key={`pack-${id}`}>
            <p>{name}</p>
            <p>New: {count_new}</p>
            <p>Learning: {count_learning + count_relearning}</p>
            <p>Review: {count_review}</p>
        </Box>
    ));

    const { t } = useTranslation('translation', {
        keyPrefix: 'vocabulary.deckList'
    });

    return (
        <Flex
            justifyContent={'space-between'}
            h={'full'}
            flexDir={'column'}>
            <Header title={t('header')}/>
            <div>
                <Block>
                    {t('content')}
                    {deck_list}
                </Block>
            </div>
            <ButtonBar>
                <Button variant={'main'}>{t('button')}</Button>
            </ButtonBar>
        </Flex>
    );
};

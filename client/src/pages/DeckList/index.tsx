import { useTranslation } from 'react-i18next';
import { Block } from '../../components/Block/inedex';
import { ButtonBar } from '../../components/ButtonBar';
import { Header } from '../../components/Header';
import { Button, Flex } from '@chakra-ui/react';
import { useGate } from 'effector-react';
import { DeckListGate } from '../../models/vocabulary';

export const DeckList = () => {
    useGate(DeckListGate);

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
                </Block>
            </div>
            <ButtonBar>
                <Button variant={'main'}>{t('button')}</Button>
            </ButtonBar>
        </Flex>
    );
};

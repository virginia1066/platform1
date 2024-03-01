import { Button, Flex, HStack } from '@chakra-ui/react';
import { ButtonBar } from '../../components/ButtonBar';
import { PageWrap } from '../../components/PageWrap';
import { useTranslation } from 'react-i18next';
import { BackButton } from '../../components/BackButton';
import { BASE_URL } from '../../constants';

const TRANS_PROPS = {
    keyPrefix: 'vocabulary.deckEdit'
} as const;

export const DeckEdit = () => {
    const { t } = useTranslation('translation', TRANS_PROPS);

    return (
        <PageWrap headerTitle={t('header')}>
            <Flex h={'full'}>

            </Flex>
            <ButtonBar>
                <HStack spacing={4}>
                    <BackButton url={`${BASE_URL}/`}/>
                    <Button w={'full'} variant={'main'} size={'lg'}>{t('buttonSave')}</Button>
                </HStack>
            </ButtonBar>
        </PageWrap>
    );
};
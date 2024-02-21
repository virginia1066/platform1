import { useTranslation } from 'react-i18next';
import { Block } from '../../components/Block/inedex';
import { ButtonBar } from '../../components/ButtonBar';
import { Header } from '../../components/Header';
import { Button, Flex } from '@chakra-ui/react'

export const DeckList = () => {

  const { t } = useTranslation();

  return (
    <Flex
      justifyContent={'space-between'}
      h={'full'}
      flexDir={'column'}>
      <Header title={t('vocabulary.deckList.header')} />
      <div>
        <Block>
          Базовые слова
        </Block>
      </div>
      <ButtonBar>
        <Button variant={"main"}>Создавть колоду</Button>
      </ButtonBar>
    </Flex>
  );
}

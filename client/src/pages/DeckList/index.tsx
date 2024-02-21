
import { Button } from 'react-bootstrap';
import { Block } from '../../components/Block/inedex';
import { ButtonBar } from '../../components/ButtonBar';
import { Header } from '../../components/Header';
import './DeckList.css';
import { useEffect } from 'react';

export const DeckList = () => {
  useEffect(() => {
    console.log(window.Telegram.WebApp.themeParams)
  },[])
  return (
    <div className="d-flex flex-column h-100 justify-content-between" style={{backgroundColor:window.Telegram.WebApp.themeParams.secondary_bg_color}}>
      <Header title='Ваши колоды' />
      <div>
        <Block>
          Базовые слова
        </Block>
      </div>
      <ButtonBar>
        <Button variant="primary">Создавть колоду</Button>
      </ButtonBar>
    </div>
  );
}

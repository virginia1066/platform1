import { ChakraProvider, Container } from '@chakra-ui/react';
import { themeParams } from './theme/defaults';
import tgTheme from './theme/tgTheme';
import { createBrowserRouter, RouterProvider, } from 'react-router-dom';
import { DeckList } from './pages/DeckList';
import { DeckEdit } from './pages/DeckEdit';
import { Deck } from './pages/Deck';
import { BASE_URL } from './constants';
import { Error403 } from './pages/Error403';
import { useEffect, useState } from 'react';
import { Navigate } from './hoks/Navigate';

const NavigatedDeckList = Navigate(DeckList);
const NavigatedDeckEdit = Navigate(DeckEdit);
const NavigatedDeck = Navigate(Deck);
const NavigatedError403 = Navigate(Error403);

const router = createBrowserRouter([
    {
        path: `${BASE_URL}/`,
        element: <NavigatedDeckList/>,
    },
    {
        path: `${BASE_URL}/edit`,
        element: <NavigatedDeckEdit/>,
    },
    {
        path: `${BASE_URL}/deck/:deckId`,
        element: <NavigatedDeck/>,
    },
    {
        path: `${BASE_URL}/403`,
        element: <NavigatedError403/>,
    },
]);


export const App = () => {
    const [ready, setReady] = useState<boolean>(false);

    useEffect(() => {
        setReady(true);
    }, []);

    return (
        <ChakraProvider theme={tgTheme}>
            <Container h={'full'} p={4} bgColor={themeParams.secondary_bg_color} opacity={0}
                       animation={ready ? '400ms linear forwards fadeIn;' : ''}>
                <RouterProvider router={router}/>
            </Container>
        </ChakraProvider>
    );
};
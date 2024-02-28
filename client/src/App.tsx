import { Container } from "@chakra-ui/react";
import { themeParams } from "./theme/defaults";
import tgTheme from './theme/tgTheme';
import { ChakraProvider } from '@chakra-ui/react';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import { DeckList } from "./pages/DeckList";
import { DeckEdit } from "./pages/DeckEdit";
import { Deck } from "./pages/Deck";

const router = createBrowserRouter([
    {
        path: "/web-app",
        element: <DeckList />,
    },
    {
        path: "/web-app/edit",
        element: <DeckEdit />,
    },
    {
        path: "/web-app/deck",
        element: <Deck />,
    },
]);

export const App = () => (
    <ChakraProvider theme={tgTheme}>
        <Container h={'full'} p={4} bgColor={themeParams.secondary_bg_color}>
            <RouterProvider router={router} />
        </Container>
    </ChakraProvider>
)/*  */
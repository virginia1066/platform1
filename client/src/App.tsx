import { Container } from "@chakra-ui/react";
import { DeckList } from "./pages/DeckList";
import { themeParams } from "./theme/defaults";

export const App = () => (
    <Container h={'full'} p={4} bgColor={themeParams.secondary_bg_color}>
        <DeckList />
    </Container>
)
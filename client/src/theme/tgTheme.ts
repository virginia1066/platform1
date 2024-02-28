import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import { fontSizes, spaces, breakpoints, sizes } from "./constants";
import { Text } from "./components/Text";
import { Colors } from "./Colors";
import { Button } from './components/Button';
import { Heading } from './components/Heading';
import { Badge } from "./components/Badge";
import { Checkbox } from "./components/Checkbox";

const tgTheme = extendTheme(withDefaultColorScheme({ colorScheme: 'primary' }), {
    colors: Colors,
    fonts: {
        heading: "'Inter', sans-serif",
        body: "'Inter', sans-serif"
    },
    components: {
        Text: Text,
        Heading: Heading,
        Button: Button,
        Badge: Badge,
        Checkbox: Checkbox,
    },
    styles: {
        global: {
            "html, body, #root": {
                height: '100%',
                minHeight: '100%',
            }
        }
    },
    space: spaces,
    fontSizes: fontSizes,
    breakpoints: breakpoints,
    sizes: sizes,
});

export default tgTheme;

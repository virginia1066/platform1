import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import { fontSizes, spaces, breakpoints, sizes } from "./constants";
import { Text } from "./components/Text";
import { Colors } from "./Colors";
import { Button } from './components/Button';
import { Heading } from './components/Heading';
import { Badge } from "./components/Badge";
import { Checkbox } from "./components/Checkbox";
import { FormLabel } from "./components/FormLabel";
import { FormError } from "./components/FormError";
import { Input } from "./components/Input";
import { themeParams } from "./defaults";

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
        FormLabel: FormLabel,
        FormError: FormError,
        Input: Input,
    },
    styles: {
        global: {
            "html, body, #root": {
                height: '100%',
                minHeight: '100%', 
                backgroundColor: themeParams.bg_color               
            },
            "@keyframes fadeIn": {
                "0%": {
                    opacity:0,
                },
                "100%": {
                    opacity: 1,
                }
            },
            '*::-webkit-scrollbar': {
                display: 'none'
            }
        }
    },
    space: spaces,
    fontSizes: fontSizes,
    breakpoints: breakpoints,
    sizes: sizes,
});

export default tgTheme;

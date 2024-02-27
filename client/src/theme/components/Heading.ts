import { fontSizes } from "../constants";
import { themeParams } from "../defaults";

export const Heading = {
    baseStyle: {
        fontFamily: "'Inter', sans-serif",
        color: themeParams.text_color,
        lineHeight: '100%',
        fontStyle: 'normal',
        fontWeight: '500'
    },
    sizes: {
        'xs': {
            fontSize: fontSizes.xs
        },
        'sm': {
            fontSize: fontSizes.sm
        },
        'md': {
            fontSize: fontSizes.md
        },
        'lg': {
            fontSize: fontSizes.lg
        },
        'xl': {
            fontSize: fontSizes.xl
        }
    }
}
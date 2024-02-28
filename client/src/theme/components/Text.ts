import { themeParams } from "../defaults";
import { fontSizes } from '../constants';

export const Text = {
    baseStyle: {
        fontFamily: "'Inter', sans-serif",
        color: themeParams.text_color,
    },
    defaultProps: {
        size: 'sm'
    },
    variants: {

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
};

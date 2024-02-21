import { fontSizes, spaces } from '../constants';
import { themeParams } from '../../defaults';

export const Button = {
    defaultProps: {
        size: 'md',
        variant: 'solid',
    },
    baseStyle: {
        fontWeight: 500,
        borderRadius: 8,
        fontSizes: fontSizes.md,
        borderWidth: "1px",
        ".chakra-button__group[data-attached][data-orientation=horizontal] > &:not(:last-of-type)":
            { marginEnd: "-1px" },
        ".chakra-button__group[data-attached][data-orientation=vertical] > &:not(:last-of-type)":
            { marginBottom: "-1px" },
    },
    sizes: {
        sm: {},
        md: {
            fontSizes: fontSizes.md,
            paddingX: spaces["7"],
            paddingY: spaces["3"]
        }
    },
    variants: {
        main: {
            bg: themeParams.button_color,
            color: themeParams.bg_color,
            borderColor: themeParams.button_color,
            _hover: {
                
            },
            _active: {
           
            },
        },
    }
};

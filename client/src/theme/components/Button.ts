import { defineStyle } from '@chakra-ui/react';
import { fontSizes, spaces } from '../constants';
import { colorScheme, themeParams } from '../defaults';
import { Colors, get_triteary_bg_color } from '../Colors';

export const Button = {
    defaultProps: {
        size: 'md',
        variant: 'solid',
    },
    baseStyle: {
        fontWeight: 500,
        borderRadius: 8,
        borderWidth: "1px",
        ".chakra-button__group[data-attached][data-orientation=horizontal] > &:not(:last-of-type)":
            { marginEnd: "-1px" },
        ".chakra-button__group[data-attached][data-orientation=vertical] > &:not(:last-of-type)":
            { marginBottom: "-1px" },
    },
    sizes: {
        sm: {
            fontSizes: fontSizes.sm,
        },
        md: {
            fontSizes: fontSizes.md,
            paddingX: spaces["7"],
            paddingY: spaces["3"]
        },
        lg: {
            fontSizes: fontSizes.lg,
        }
    },
    variants: {
        color: defineStyle((props) => {
            const { colorScheme: c } = props;
            return {
                bg: `${c}`,
                color: themeParams.button_text_color,
                borderColor: `${c}`,
                _hover: {
    
                },
                _active: {
    
                },
            };
        }),
        main: {
            bg: themeParams.button_color,
            color: themeParams.button_text_color,
            borderColor: themeParams.button_color,
            _hover: {

            },
            _active: {

            },
        },
        delete: {
            bg: Colors.red,
            color: themeParams.button_text_color,
            borderColor: Colors.red,
            _hover: {

            },
            _active: {

            },
        },
        edit: {
            bg: get_triteary_bg_color(colorScheme),
            color: themeParams.hint_color,
            borderColor: get_triteary_bg_color(colorScheme),
            _hover: {

            },
            _active: {

            },
        },
        link: {
            minW: 0,
            minH: 0,
            border: 'none',
            color: themeParams.link_color
        },
    }
};

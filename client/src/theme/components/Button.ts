import { defineStyle } from '@chakra-ui/react';
import { fontSizes, spaces } from '../constants';
import { themeParams } from '../defaults';
import { Colors } from '../Colors';

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
                bg: `${c}.500`,
                color: themeParams.button_text_color,
                borderColor: `${c}.500`,
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
            bg: Colors.red[500],
            color: themeParams.button_text_color,
            borderColor: Colors.red[500],
            _hover: {

            },
            _active: {

            },
        },
        edit: {
            bg: Colors.triteary_bg_color[500],
            color: themeParams.hint_color,
            borderColor: Colors.triteary_bg_color[500],
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

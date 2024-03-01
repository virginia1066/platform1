import { cssVar } from "@chakra-ui/react"
import { themeParams } from "../defaults"
import { Colors } from "../Colors"


const $size = cssVar("checkbox-size")

export const Checkbox = {
    // The base styles for each part
    baseStyle: {},
    // The size styles for each part
    sizes: {},
    // The variant styles for each part
    variants: {
        'tg': {
            control: {
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                userSelect: "none",
                w: $size.reference,
                h: $size.reference,
                transitionProperty: "box-shadow",
                transitionDuration: "normal",
                border: "2px solid",
                borderRadius: '4px',
                borderColor: themeParams.button_color,
                color: themeParams.button_color,
                verticalAlign: "top",
                paddong:8,
                _checked: {
                    bg: themeParams.bg_color,      
                    color: themeParams.button_color,

                    _hover: {
                        bg: themeParams.bg_color,
                    },
                    _disabled: {
                        opacity: 0.6
                    },
                },

                _disabled: {
                    opacity: 0.6
                },

                _invalid: {
                    borderColor: Colors.red,
                },
            }
        }

    },
    // The default `size` or `variant` values
    defaultProps: {
        variant: 'tg',
    },
}
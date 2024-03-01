import { inputAnatomy as parts } from "@chakra-ui/anatomy"
import {
    createMultiStyleConfigHelpers,
    cssVar,
    defineStyle,
} from "@chakra-ui/styled-system"
import { themeParams } from "../defaults"
import { Colors } from "../Colors"

const { definePartsStyle } =
    createMultiStyleConfigHelpers(parts.keys)

const $height = cssVar("input-height")
const $fontSize = cssVar("input-font-size")
const $padding = cssVar("input-padding")
const $borderRadius = cssVar("input-border-radius")

const size = {
    lg: defineStyle({
        [$fontSize.variable]: "fontSizes.lg",
        [$padding.variable]: "space.4",
        [$borderRadius.variable]: "radii.md",
        [$height.variable]: "sizes.12",
    }),
    md: defineStyle({
        [$fontSize.variable]: "fontSizes.md",
        [$padding.variable]: "space.4",
        [$borderRadius.variable]: "radii.md",
        [$height.variable]: "sizes.10",
    }),
    sm: defineStyle({
        [$fontSize.variable]: "fontSizes.sm",
        [$padding.variable]: "space.3",
        [$borderRadius.variable]: "radii.sm",
        [$height.variable]: "sizes.8",
    }),
    xs: defineStyle({
        [$fontSize.variable]: "fontSizes.xs",
        [$padding.variable]: "space.2",
        [$borderRadius.variable]: "radii.sm",
        [$height.variable]: "sizes.6",
    }),
}

export const Input = {
    baseStyle: definePartsStyle({
        addon: {
            height: $height.reference,
            fontSize: $fontSize.reference,
            px: $padding.reference,
            borderRadius: $borderRadius.reference,
        },
        field: {
            width: "100%",
            height: $height.reference,
            fontSize: $fontSize.reference,
            px: $padding.reference,
            borderRadius: $borderRadius.reference,
            minWidth: 0,
            outline: 0,
            position: "relative",
            appearance: "none",
            transitionProperty: "common",
            transitionDuration: "normal",
            _disabled: {
                opacity: 0.4,
                cursor: "not-allowed",
            },
        },
    }),
    sizes: {
        lg: definePartsStyle({
            field: size.lg,
            group: size.lg,
        }),
        md: definePartsStyle({
            field: size.md,
            group: size.md,
        }),
        sm: definePartsStyle({
            field: size.sm,
            group: size.sm,
        }),
        xs: definePartsStyle({
            field: size.xs,
            group: size.xs,
        }),
    },
    variants: {
        tg: {
            field: {
                border: "2px solid",
                borderColor: "transparent",
                bg: themeParams.secondary_bg_color,
                _hover: {
                    bg: themeParams.secondary_bg_color,
                },
                _readOnly: {
                    boxShadow: "none !important",
                    userSelect: "all",
                },
                _invalid: {
                    borderColor: Colors.red,
                },
                _focusVisible: {
                    bg: "transparent",
                    borderColor: themeParams.secondary_bg_color,
                },
            },
            addon: {
                border: "2px solid",
                borderColor: "transparent",
                bg: themeParams.secondary_bg_color,
            },
        }
    },
    defaultProps: {
        size: "md",
        variant: "filled",
      },
}




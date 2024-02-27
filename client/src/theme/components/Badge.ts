import { defineCssVars, defineStyle } from "@chakra-ui/react"
import { fontSizes } from "../constants"

const vars = defineCssVars("badge", ["bg", "color", "shadow"])

export const Badge = {
    defaultProps: {
        variant: 'simple'
    },
    baseStyle: {
        borderRadius: 8,
        paddingY: '2px',
        paddingX: '6px',
        color: 'white',
        textTransform: "uppercase",
        fontSize: fontSizes.xs,
        fontWeight: "500",
    },
    variants: {
        'simple': defineStyle((props) => {
            const { colorScheme: c } = props
            return {
                [vars.bg.variable]: `colors.${c}.500`,
            }
        })
    }
}

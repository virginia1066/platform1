import { fontSizes } from "../constants";
import { themeParams } from "../defaults";

export const FormLabel = {
    baseStyle: {
        fontSize: fontSizes.xs,
        color: themeParams.hint_color,
        paddingX: 5,
        mb: 3,
        fontWeight: "medium",
        transitionProperty: "common",
        transitionDuration: "normal",
        opacity: 1,
        _disabled: {
            opacity: 0.6,
        }
    }
}
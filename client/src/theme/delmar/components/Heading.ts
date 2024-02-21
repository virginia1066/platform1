import { themeParams } from "../../defaults";
import { fontSizes } from "../constants";

export const Heading = {
    baseStyle: {
        fontFamily: "'Inter', sans-serif",
        color: themeParams.text_color,
        lineHeight: '100%',
        fontStyle: 'normal',
    },
    defaultProps: {
         variant: 'normal'   
    },
}
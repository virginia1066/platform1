import { cssVar, defineStyle } from "@chakra-ui/react";
import { Colors } from "../Colors";

const $fg = cssVar("form-error-color")

export const FormError = {
    baseStyle: {
        text: defineStyle({
            [$fg.variable]: Colors.red,
            _dark: {
              [$fg.variable]: Colors.red,
            },
            color: $fg.reference,
            mt: "2",
            fontSize: "xs",
            paddingX: 5,
            lineHeight: "normal",
          }),
        icon: defineStyle({
            marginEnd: "0.5em",
            [$fg.variable]: Colors.red,
            _dark: {
              [$fg.variable]: Colors.red,
            },
            color: $fg.reference,
          }),
      }
}
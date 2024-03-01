import { Box } from "@chakra-ui/react";
import { FC } from "react";
import { Colors } from "../../theme/Colors";
import { themeParams } from "../../theme/defaults";

export const BlockLabel: FC<{ text: string, color?: string }> = ({ text, color = null }) => (
    <Box bgColor={color ? color : Colors.green}
        position={'absolute'}
        borderTopLeftRadius={8}
        borderBottomRightRadius={8}
        fontSize={'xs'}
        px={3}
        py={2}
        left={0}
        top={0}
        color={themeParams.bg_color}>
        {text}
    </Box>
)
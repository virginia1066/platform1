import { Box } from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";
import { themeParams } from "../../theme/defaults";

export const Block:FC<PropsWithChildren> = ({children}) => (
    <Box bgColor={themeParams.bg_color} borderRadius={8} p={5}>
        {children}
    </Box>
)
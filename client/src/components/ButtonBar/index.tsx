import { Box } from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";

export const ButtonBar: FC<PropsWithChildren> = ({ children }) => (
    <Box w={'full'}>
        {children}
    </Box>
)
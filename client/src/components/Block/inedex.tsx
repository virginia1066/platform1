import { Flex, FlexProps } from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";
import { themeParams } from "../../theme/defaults";

export const Block:FC<PropsWithChildren<FlexProps>> = ({children, ...flexProps}) => (
    <Flex w={'-webkit-fill-available'} overflow={'hidden'} position={'relative'} alignItems={'center'} bgColor={themeParams.bg_color} borderRadius={8} p={5} {...flexProps}>
        {children}
    </Flex>
)
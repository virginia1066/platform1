import { Flex, VStack } from "@chakra-ui/react";
import { FC, PropsWithChildren } from "react";
import { Header } from "../Header";

export const PageWrap: FC<PropsWithChildren<{ headerTitle: string | null }>> = ({ children, headerTitle = null }) => (
    <Flex h={'full'} direction={'column'} gap={3}>
        {
            headerTitle
                ? <Header title={headerTitle} />
                : null
        }
        <Flex h={'full'}
            gap={3}
            flexDir={'column'}>
            {children}
        </Flex>
    </Flex>

)
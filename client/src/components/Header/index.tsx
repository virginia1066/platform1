import { Heading } from "@chakra-ui/react";
import { FC } from "react";

export const Header:FC<{title:string}> = ({title}) => (
    <Heading textAlign={'center'} size={'lg'}>{title}</Heading>
)
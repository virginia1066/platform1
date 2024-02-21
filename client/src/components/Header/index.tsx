import { FC } from "react";

export const Header:FC<{title:string}> = ({title}) => (
    <div>{title}</div>
)
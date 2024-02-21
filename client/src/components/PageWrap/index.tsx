import { FC, PropsWithChildren } from "react";
import { Button } from "react-bootstrap";

export const PageWrap:FC<PropsWithChildren<{title:string}>> = ({title, children}) => (
    <div className="d-flex flex-column h-100 justify-content-between">
        <div>{title}</div>
        <div>{children}</div>
        <div><Button/></div>
    </div>
)
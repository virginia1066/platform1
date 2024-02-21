import { FC, PropsWithChildren } from "react";
import { Button } from "react-bootstrap";

export const ButtonBar: FC<PropsWithChildren> = ({ children }) => (
    <div>
        {children}
    </div>
)
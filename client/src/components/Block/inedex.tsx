import { FC, PropsWithChildren } from "react";

export const Block:FC<PropsWithChildren> = ({children}) => (
    <div>
        {children}
    </div>
)
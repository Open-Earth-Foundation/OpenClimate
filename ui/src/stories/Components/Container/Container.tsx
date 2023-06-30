import React, {FC, ReactNode } from "react";
import style from "./Container.module.scss";

interface ContainerProps {
    children: ReactNode[] | ReactNode
}

const Container:FC<ContainerProps> = ({
    children
}) => {
    return(
        <div className={style.root}>
            {children}
        </div>
    )
}

export default Container;
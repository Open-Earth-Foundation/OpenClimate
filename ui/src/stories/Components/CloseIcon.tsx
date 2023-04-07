import React, { FC } from "react";
import { MdClose } from "react-icons/md";

interface Props {
    size: number,
    color: string
}

export const CloseIcon:FC<Props> = ({size= 24, color= "#7A7B9A"}) => (
    <MdClose size={size} color={color}/>
)
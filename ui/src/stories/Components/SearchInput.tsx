import React, { FC } from "react";
import { MdSearch } from "react-icons/md";
import styles from "./SearchInput.module.scss";

interface Props {
    actorType: string;
    isActive: boolean
}

export const SearchInput:FC<Props> = ({actorType = "Country", isActive=true}) => {
    return (
        <div className={styles.root} style={{backgroundColor: isActive ? "#fff": "#D7D8FA"}}>
            <div className={styles.dropdownWrapper}>
                <MdSearch className={styles.icon}/>
                <input  className={styles.input} placeholder={`Search by ${actorType}`}/>
            </div>
        </div>
    )
}


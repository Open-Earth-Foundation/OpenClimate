import React from "react";
import { MdSearch } from "react-icons/md";
import styles from "./Button.module.scss";

export const Button = () => {
    return(
        <button className={styles.button}>
            <MdSearch className={styles.icon}/>
            <span>Explore Actor</span>
        </button>
    )
}
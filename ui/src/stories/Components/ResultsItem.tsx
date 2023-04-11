import React, { FC } from "react";
import styles from "./ResultsItem.module.scss";
import { ReactComponent as DatabaseWarningEmpty } from "../../assets/database-warning.svg";
import { ReactComponent as DatabaseWarningEmptyFilled } from "../../assets/database-warning-white.svg";

interface Props {
    actorName: string
}

export const ResultsItem:FC<Props> = ({actorName = "Brazil"}) => {
    return(
        <div className={styles.searches}>
            <div className={styles.root}>
                <span className={styles.actorName}>{actorName}</span>
                <DatabaseWarningEmpty className={styles.resIcon}/>
            </div>
        </div>
    )
}



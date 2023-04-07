import React, { FC, useState } from "react";
import { SearchInput } from "./SearchInput";
import styles from "./SearchForm.module.scss";
import { ResultsItem } from "./ResultsItem";

const data = [
    {   
        id: 1,
        actorName: "Argentina",
    },
    {   
        id: 2,
        actorName: "Brazil",
    },
    {   
        id: 3,
        actorName: "Canada",
    }

]

interface Props{
    actorType: string,
    hasData: boolean
}

export const SearchForm:FC<Props> = ({actorType, hasData = false}) => {   
    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <div className={styles.inputBox}>
                    <p className={styles.actorType}>{actorType}</p>
                    <SearchInput actorType="Country" isActive={true}/>
                </div>
                <div className={styles.searchResultsContent}>
                    <div className={styles.recentRes}>
                        {
                            hasData ? (
                                <>
                                    {
                                        data.map(({id, actorName})=> <ResultsItem key={id} actorName={actorName}/>)
                                    }
                                </>
                            ) : (
                                <>
                                    <p>RECENT RESULTS</p>
                                        {
                                            data.map(({id, actorName})=> <ResultsItem key={id} actorName={actorName}/>)
                                        }
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}



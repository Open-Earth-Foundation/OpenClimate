import React, { FC } from 'react';
import styles from "./ContextualDataWidget.module.scss";
import PropTypes from 'prop-types';
import { DonutChart } from "react-circle-chart";
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined';
import Diversity3 from '@mui/icons-material/Diversity3';
import { height } from '@mui/system';

/**
    - Use a contextual data widget for showing contextual data
    - It shoulbe be responsive depending on screen size - width
    - it should show both non empty and empty states
**/

export const ContextualDataWidget = ({  
    backgroundColor="#ffffff", 
    headerTextColor="#00001F", 
    subTextColor="#7A7B9A;", 
    donutColor="#2351DC",
    donutTrackColor="#D7D8FA",
    hasData=true
}
    ) => {

        // Donut items
        const items = [
            {
            value: 90,
            label: "Total",
            color: donutTrackColor,
            },
            {
            value: 10,
            label: "Difference",
            color: donutColor,
            },
        ];
    return (
        <div 
            className={styles.main}
            style={{
                backgroundColor: backgroundColor,
                height: hasData ? "" : "264px"
            }}
        >

            {/* Header */}
            <div 
                className={styles.header} 
                style={{
                    color: headerTextColor,
                    }}
            >
                <h1>Contextual Data</h1>
                <span>Last updated in 2018</span>
            </div>

            {/* Body */}
            <div
                className={styles.body}
            >
                { hasData ? ( 
                    <div>
                        <div className={styles.percentDataItem} 
                            style={{
                                borderBottom: "1px solid #D7D8FA"
                            }}
                        >
                            <div
                                className={styles.donut}
                            >
                                <DonutChart
                                    items={items}
                                    size={48}
                                    showTotal={false}
                                    tooltipSx={{ display: "none" }}
                                
                                />
                            </div>
                            <div
                                className={styles.dataValue}
                            >
                                <div
                                    className={styles.value}
                                >
                                    11.7%
                                </div>
                                <div
                                    className={styles.description}
                                >
                                    of United States of America’s population
                                </div>  
                                <div
                                    className={styles.dataSource}
                                >
                                    Source: World Populaion Prospect 
                                </div>
                                <div
                                    className={styles.year}
                                >
                                    Year: 2022
                                </div>
                            </div>
                        </div>
                        <div className={styles.percentDataItem} >
                            <div
                                className={styles.icon}
                            >
                                <PeopleAltOutlinedIcon />
                            </div>
                            <div
                                className={styles.dataValue}
                            >
                                <div
                                    className={styles.value}
                                >
                                    1,425.8<span>M</span>
                                </div>
                                <div
                                    className={styles.description}
                                >
                                    Total population
                                </div>  
                                <div
                                    className={styles.dataSource}
                                >
                                    Source: World Populaion Prospect 
                                </div>
                                <div
                                    className={styles.year}
                                >
                                    Year: 2022
                                </div>
                            </div>
                        </div>
                        <div className={styles.percentDataItem} >
                            <div
                                className={styles.icon}
                            >
                                <MonetizationOnOutlinedIcon />
                            </div>
                            <div
                                className={styles.dataValue}
                            >
                                <div
                                    className={styles.value}
                                >
                                    19,485T<span>USD</span>
                                </div>
                                <div
                                    className={styles.description}
                                >
                                    GDP
                                </div>  
                                <div
                                    className={styles.dataSource}
                                >
                                    Source: World Economic Outlook
                                </div>
                                <div
                                    className={styles.year}
                                >
                                    Year: 2022
                                </div>
                            </div>
                        </div>

                        <div className={styles.percentDataItem} >
                            <div
                                className={styles.icon}
                            >
                                <AspectRatioOutlinedIcon />
                            </div>
                            <div
                                className={styles.dataValue}
                            >
                                <div
                                    className={styles.value}
                                >
                                    9.7M<span>KM<sup>2</sup></span>
                                </div>
                                <div
                                    className={styles.description}
                                >
                                    Total Area
                                </div>  
                                <div
                                    className={styles.dataSource}
                                >
                                    Source: Land Area (AG.LND.TOTL.K2)
                                </div>
                                <div
                                    className={styles.year}
                                >
                                    Year: 2022
                                </div>
                            </div>
                        </div>
                    </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <p>
                                There's no data available, if you have any suggested data sources or you are a provider please
                            </p>
                            <button className={styles.btn}>
                                <Diversity3 className={styles.emptyStateIcon}/>
                                <span>collaborate with data</span>
                            </button>
                        </div>
                    )
                }
            </div>
        </div>
    )
}


ContextualDataWidget.propTypes = {
    backgroundColor: PropTypes.string,
    headerTextColor: PropTypes.string,
    subTextColor: PropTypes.string,
    donutColor: PropTypes.string,
    hasData: PropTypes.bool
}

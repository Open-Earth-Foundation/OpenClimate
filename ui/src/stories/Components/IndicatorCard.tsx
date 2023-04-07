import React, { FC } from "react";
import { MdArrowForward } from "react-icons/md";
import styles from "./IndicatorCard.module.scss";
import { DonutChart } from "react-circle-chart";

interface Props {
    actorName: string
}

export const IndicatorCard:FC<Props> = ({actorName = "Earth"}) => {
    // Donut items
    const items = [
        {
        value: 30,
        label: "Total",
        color: "#E6E7FF",
        },
        {
        value: 70,
        label: "Difference",
        color: "#F9A200",
        },
    ];
    return(
        <div className={styles.root}>
            <div className={styles.container}>
                <div className={styles.flag}>
                    <svg width="23" height="24" viewBox="0 0 23 24" fill="green" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.4821 4.14096L16.1374 3.72715L17.3789 4.14096L19.448 4.55478L20.6895 3.72715C21.3826 4.45259 21.9806 5.26325 22.4689 6.13972L22.3448 6.21008L19.8619 7.0377L17.3789 6.62389L16.5513 5.3824H14.0684L12.8269 6.62389L13.2407 9.52063L16.1375 10.7621L17.7928 10.3483L19.0342 11.1759V12.8312L19.8619 14.4865L20.6895 16.1418V17.7971L21.8068 18.9144C17.9852 24.3297 10.497 25.6213 5.08215 21.7996C0.483327 18.5536 -1.24191 12.5477 0.933563 7.35636L1.65361 9.52063L2.8951 10.3483L4.13658 11.1759L3.30891 12.0036V13.245L4.13654 14.9003L6.20565 15.3142V19.4524L7.03328 21.5215L8.27476 21.9353V19.8662L9.93006 18.6247V17.3832L11.5854 15.7279L11.9992 13.6588H10.3439L9.10239 11.5897H6.20565L5.37802 9.9344L4.13654 11.1759V9.52058L3.30891 8.693V7.45152L6.20565 7.0377L8.27476 5.79622L9.51625 3.7271L10.7577 3.31329L11.1716 2.0718L8.68862 1.65799L7.51337 0.871705C10.6957 -0.409907 14.2744 -0.268391 17.3458 1.26072L15.7236 2.0718H14.0683L13.2407 3.7271L14.4821 4.14096Z" fill="#86DAF1"/>
                    </svg>
                </div>
                <div className={styles.actorName}>
                    {actorName}
                </div>
                <div className={styles.infoItem}>
                    <div className={styles.indicatorArrow}>
                        <MdArrowForward className={styles.arrowTrendUp} />
                    </div>
                    <div className={styles.infoItemValues}>
                        <p>
                            49.8 <span>GtCO2e</span>
                        </p>
                        <span className={styles.year}>in 2019</span>
                    </div>
                </div>
                <div className={styles.infoItemA}>
                    <div className={styles.indicatorDonut}>
                        <DonutChart
                            items={items}
                            size={18}
                            showTotal={false}
                            trackWidth={"lg"}
                            tooltipSx={{ display: "none" }}
                        />
                    </div>
                    <div className={styles.infoItemValues}>
                        <p>
                            287.4 <span>GtCO2e</span>
                        </p>
                        <span className={styles.year}>left based on 1.5<sup>o</sup> target</span>
                    </div>
                </div>
            </div>
        </div>
    );
}


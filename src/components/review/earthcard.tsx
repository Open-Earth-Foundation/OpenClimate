import { FunctionComponent, useEffect, useState } from "react";
import { MdArrowDownward, MdArrowUpward} from "react-icons/md"
import {DonutChart} from 'react-circle-chart'
import { FilterTypes } from "../../api/models/review/dashboard/filterTypes";


interface IProps {
    parent: any
    actors: Array<any>
    label: string
}

const EarthCard:FunctionComponent<IProps> = (props) => {
    const {parent, actors, label} = props
    const [cardData, setCardData] = useState<Array<object>>();
    const [emsData, setEmissionsData] = useState<any>()

    // Donut earth props items
    const items = [
        {
            value: 32,
            label: "Total",
            color: "#D9D9D9"
        },
        {
            value: 68,
            label: "Difference",
            color: "#FA7200"
        },
    ]
    const items2 = [
        {
            value: 90,
            label: "Total",
            color: "#D9D9D9"
        },
        {
            value: 10,
            label: "Difference",
            color: "#2351DC"
        },
    ]

    useEffect(()=> {
        if (parent == null && actors.length == 1) {
            const u = actors;
            u[0] = {...u[0], label: "Globe" }
            setCardData(u)
            
            console.log(cardData)
        }
        else if(parent && actors.length == 2) {
            const u = actors
            u[0] = {...u[1], label: "Country" }
            setCardData(u)
            const sources = (u && u[0].emissions) ? Object.keys(u[0].emissions) : []
            sources.sort()
            const defaultSource = (sources.length > 0) ? sources[0] : null;
            const defaultYear = (defaultSource && u[0].emissions[defaultSource].data.length > 0) ? u[0].emissions[defaultSource].data[0].year : null
            const latestYear = defaultYear;
            const currentEmissions = (defaultSource && defaultYear) ? u[0].emissions[defaultSource].data.find((e:any) => e.year == latestYear) : null
            console.log(sources, defaultSource, latestYear);
            // const emsData = u[0]
            setEmissionsData(currentEmissions?.total_emissions);
            console.log(cardData);
        }
    },[cardData, emsData])

    return (
        <div>
            <span className="review__actor-type">{!cardData ? "" : cardData[0]?.label}</span>
            <div className="review__earth-card">
                <div className="review__earth-card-head">
                    <span>{!cardData ? "" : cardData[0]?.name}</span>
                </div>
                <div className='review__earth-card-body'>
                    <div className="review__earth-card-content">
                        <div>
                            <MdArrowUpward className="review__earth-card-item-icon"/>
                            <span className="review__earth-card-item-large-text">{emsData? (emsData / 1000000.0).toPrecision(5): "49.8"}</span>
                            <span className="review__earth-card-item-small-text">GtCO<sub>2</sub>eq</span>
                        </div>
                        <div className="review__earth-card-item-normal-text">in 2019</div>
                    </div>
                    {
                        parent ? "" :
                        <div className="review__earth-card-content donut-card">
                            <div className='donut'>
                                <DonutChart items={items} size={30} showTotal={false} tooltipSx={{display: "none"}} trackColor="#D9D9D9"/>
                            </div>
                            <div className='right-column'>
                                <div>
                                    <span className="review__earth-card-item-large-text">287.4</span>
                                    <span className="review__earth-card-item-small-text">GtCO<sub>2</sub>eq</span>
                                </div>
                                <div className="review__earth-card-item-normal-text target-text">Left based on 1.5 target</div>
                            </div>
                        </div>
                    }
                    <div className="review__earth-card-content" style={{position: "relative", top: parent ? "85px": "0px"}}>
                    {
                        parent ?
                        <>
                            <div>
                                <MdArrowDownward className="review__earth-card-item-icon" style={{color: "#008600", transform: "rotate(-45deg)"}}/>
                                <span className="review__earth-card-item-large-text">30%</span>
                                <span className="review__earth-card-item-small-text"></span>
                            </div>
                            <div className="review__earth-card-item-normal-text">Pleadged by 2030</div>
                        </>
                        :
                        <>
                            <div>
                                <MdArrowUpward className="review__earth-card-item-icon"/>
                                <span className="review__earth-card-item-large-text">1.1 <sup>o</sup>C</span>
                                <span className="review__earth-card-item-small-text"></span>
                            </div>
                            <div className="review__earth-card-item-normal-text">Temperature <br /> since  1880</div>
                        </>
                        
                    }
                    </div>
                    <div className="review__earth-card-content donut-card co2concentration" style={{position: "relative", left: parent ? "-10px": "0px"}}>
                       {
                        parent ?  
                        
                        <>
                            <div className='donut'>
                                <DonutChart items={items2} size={30} showTotal={false} tooltipSx={{display: "none"}} trackColor="#D9D9D9"/>
                            </div>
                            <div className='right-column'>
                                <div>
                                    <span className="review__earth-card-item-large-text">10%</span>
                                    <span className="review__earth-card-item-small-text"></span>
                                </div>
                                <div className="review__earth-card-item-normal-text target-text">{`Of ${parent?.name} Population`}</div>
                            </div>
                        </> :
                        <div className=''>
                            <div>
                                <MdArrowUpward className="review__earth-card-item-icon"/>
                                <span className="review__earth-card-item-large-text">415.3</span>
                                <span className="review__earth-card-item-small-text">ppm</span>
                            </div>
                            <div className="review__earth-card-item-normal-text">atmospheric CO<sub>2 </sub>concentration</div>
                        </div>
                       }
                    </div>

                </div>
            </div>
        </div>
    )
}

export default EarthCard
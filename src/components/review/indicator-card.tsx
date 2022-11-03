import { FunctionComponent, useEffect, useState } from "react";
import { MdArrowDownward, MdArrowUpward} from "react-icons/md"
import {DonutChart} from 'react-circle-chart'
import {Close} from '@mui/icons-material'
import { FilterTypes } from "../../api/models/review/dashboard/filterTypes";
import { deselectFilter } from "../../store/review/review.actions";


interface IProps {
    parent: any,
    current: any,
    label: string,
    isActive: boolean,
    onDeSelect?: () => void
}

const IndicatorCard:FunctionComponent<IProps> = (props) => {
    const {parent, current, label, isActive, onDeSelect} = props
    const [cardData, setCardData] = useState<any>({});
    const [emsData, setEmissionsData] = useState<any>();
    const [currentPopulation, setCurrPopulation] = useState<number>()
    const [parentPopulation, setParPopulation] = useState<number>()
    const [targetsData, setTargetsData] = useState<any>(null)
    const [year, setYear] = useState<number>();

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
        if (parent == null) {
            const u = current;
            setCardData(u);
        }
        else {
            const u = current
            setCardData(u)
            const sources = (u && current.emissions) ? Object.keys(current.emissions) : []
            sources.sort()
            const defaultSource = (sources.length > 0) ? sources[0] : null;
            const defaultYear = (defaultSource && current.emissions[defaultSource].data.length > 0) ? current.emissions[defaultSource].data[0].year : null
            const latestYear = defaultYear;
            setYear(latestYear);
            const currentEmissions = (defaultSource && defaultYear) ? current.emissions[defaultSource].data.find((e:any) => e.year == latestYear) : null;
            const population = (defaultYear && current.population.length) ? current.population.slice().sort((p:any) => Math.abs(p.year - defaultYear)).find((p:any) => Math.abs(p.year - defaultYear) <= 5) : null
            const parentPopulation = (defaultYear && parent.population.length) ? parent.population.slice().sort((p:any) => Math.abs(p.year - defaultYear)).find((p:any) => Math.abs(p.year - defaultYear) <= 5) : null
            const target = current?.targets.slice().find((target: { target_unit: string; }) => target.target_unit === 'percent') ?? null;
            setCurrPopulation(population?.population)
            setParPopulation(parentPopulation?.population)
            setEmissionsData(currentEmissions?.total_emissions);
            target && setTargetsData(target);
        }
    },[cardData, emsData, current, parent])

    return (
        <div>
            <span className="review__actor-type">{label || ''}</span>
            <div className={isActive ? "review__earth-card-active" : "review__earth-card-inactive"} >
                <div className="review__earth-card-head">
                    <span className="review__earth-card-item-head-text-span">{cardData?.name ?? ''}</span>
                    {onDeSelect && <Close className="review__earth-card-close-icon" onClick={onDeSelect}/> }
                </div>
                <div className='review__earth-card-body'>
                    <div className="review__earth-card-content">
                        <div className="review__earth-card-emissions-info">
                            <MdArrowUpward className="review__earth-card-item-icon" style={!emsData && parent !== null ? {color: '#7A7B9A'} : { color: '#F23D33'}}/>
                            <span className="review__earth-card-item-large-text" style={!emsData && parent !== null ? {color: '#7A7B9A'} : { color: '#00001F'}}>{!emsData && parent !== null ? "N/A" : emsData && (emsData / 1000000.0).toPrecision(5) || '49.8'}</span>
                            {!emsData && parent !== null ? <></> : <span className="review__earth-card-item-small-text">GtCO<sub>2</sub>eq</span>}
                        </div>
                        <div className="review__earth-card-item-normal-text" style={!emsData && parent !== null ? {color: '#7A7B9A'} : { color: '#00001F'}}>{!emsData && parent ? 'No data available' : `in ${year || 'N/A'}`}</div>
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
                            <div className="review__earth-card-pledge-info">
                                <MdArrowDownward className="review__earth-card-item-icon" style={{color: targetsData ? "#008600" : "#7A7B9A", transform: "rotate(-45deg)"}}/>
                                <span className="review__earth-card-item-large-text" style={targetsData ? {color: '#00001F'} : { color: '#7A7B9A'}}>{targetsData ? `${targetsData?.target_value}%` : 'N/A'} </span>
                                <span className="review__earth-card-item-small-text" ></span>
                            </div>
                            <div className="review__earth-card-item-normal-text" style={targetsData ? {color: '#00001F'} : { color: '#7A7B9A'}}>{targetsData ? `Pledged by ${targetsData?.target_year} ` : 'No data available'} </div>
                            <div className="review__earth-card-item-normal-text" style={targetsData ? {color: '#00001F'} : { color: '#7A7B9A'}}>{targetsData && `from ${targetsData?.baseline_year}`} </div>
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
                                <DonutChart items={currentPopulation && parentPopulation ? [{...items2[0], value: 100 - (currentPopulation/parentPopulation)*100}, {...items2[1], value: (currentPopulation/parentPopulation)*100 }] : [{value: 0, label: '', color: '#D9D9D9'}]} size={30} showTotal={false} tooltipSx={{display: "none"}} trackColor="#D9D9D9"/>
                            </div>
                            <div className='right-column'>
                                <div>
                                    <span className="review__earth-card-item-large-text" style={currentPopulation && parentPopulation ? {color: '#00001F'} : { color: '#7A7B9A'}}>{currentPopulation && parentPopulation ? ((currentPopulation/parentPopulation)*100).toFixed(3) : 'N/A'}%</span>
                                    <span className="review__earth-card-item-small-text"></span>
                                </div>
                                <div className="review__earth-card-item-normal-text target-text" style={currentPopulation && parentPopulation ? {color: '#00001F'} : { color: '#7A7B9A'}} >{ currentPopulation && parentPopulation ? `Of ${parent?.name}'s Population` : 'No available data'}</div>
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

export default IndicatorCard;
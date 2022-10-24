import {FunctionComponent, useEffect, useState} from 'react';
import './emissions-widget.scss';
import {MdInfoOutline, MdArrowDropDown, MdArrowDropUp, MdOutlinePeopleAlt} from "react-icons/md";
import { Emissions, IEmissionsData } from '../review.page';
import {Select, MenuItem, SelectChangeEvent, FormControl} from '@mui/material';

interface Props {
    emissionInfo: IEmissionsData
}


const EmissionsWidget: FunctionComponent<Props> = (props) => {

    const {emissionInfo} = props;

    const sources = emissionInfo?.sources;
    const sourceToEmissions = emissionInfo?.sourceToEmissions;

    const [currentSource, setCurrentSource] = useState<string>('');
    const [currentYear, setCurrentYear] = useState<number>(0);
    const [currentEmissions, setCurrentEmissions] = useState<Emissions>();
    const [canCalculateTrend, setCanCalculateTrend] = useState<boolean>(true);
    const years = sourceToEmissions && sources && Object.keys(sourceToEmissions[sources[0]]?.yearToEmissions);
    const latestYear = parseInt(years?.[years.length - 1]) ?? 0;


    useEffect(() => {
        if (sources?.length && Object.keys(sourceToEmissions)?.length) {
            setCurrentSource(sources[0]);
            const emissionBySource = sourceToEmissions[sources[0]];
            setCurrentYear(emissionBySource.latestYear)
            setCurrentEmissions({
                totalEmissions: emissionBySource.latestTotalEmissions,
                landSink: emissionBySource.latestLandSinks,
                methodologies: emissionBySource.latestMethodologies
            })
        }
    }, []);

    useEffect(() => {
        if (sources?.length && Object.keys(sourceToEmissions)?.length && currentSource) {
            const emissionsToYear = sourceToEmissions[currentSource].yearToEmissions;
            const emissionsByYear = emissionsToYear[currentYear];
            setCanCalculateTrend(currentYear !== parseInt(years[0]));
            setCurrentEmissions({
                totalEmissions: emissionsByYear.totalEmissions,
                landSink: emissionsByYear.landSink ,
                methodologies: emissionsByYear.methodologies
            })
        }
    }, [currentYear, emissionInfo]);

    const calculateTrend = () => {
        const emissionsToYear = sourceToEmissions[currentSource].yearToEmissions;
        const previousYear = currentYear - 1;
        if (previousYear in emissionsToYear) {
            const oldValue = emissionsToYear[previousYear - 1]?.totalEmissions;
            const newValue = currentEmissions?.totalEmissions;
            const trend = newValue ? ((newValue - oldValue) / oldValue) * 100 : 0
            return parseInt(trend.toPrecision(5));
        } else {
            return 0;
        }
    }

    const yearChangeHandler = (e: SelectChangeEvent<number>) => {
        const value = e.target.value as number;

        setCurrentYear(value);
    }


    return(
        <div className="emissions-widget" style={{height: currentEmissions ? '': "268px"}}>
            {
                currentEmissions ?
                <div className="emissions-widget__wrapper">
                <div className="emissions-widget__metadata">
                    <div>
                        <div className='emissions-widget__metadata-inner'>
                            <span className='emissions-widget__title'>
                                Total emissions
                            </span>
                            <span>
                                <MdInfoOutline className="emissions-widget__icon"/>
                            </span>
                        </div>
                        <span className="emissions-widget__last-updated">{`Last updated in ${latestYear}`}</span>
                    </div>
                    <div className="emissions-widget__metadata-right">
                        <div className="emissions-widget__metadata-right-inner">
                            <div className='emissions-widget__source-label'>Source</div>
                            <div className='emissions-widget__source-title'>
                                <span>
                                    {sources?.[0]}
                                </span> 
                                <MdArrowDropDown className="emissions-widget__icon arrow"/>
                            </div>
                        </div>
                        <div className="emissions-widget__metadata-right-inner">
                            <div className='emissions-widget__source-label'>Year</div>
                            <div className='emissions-widget__source-title'>
                                <FormControl variant="standard" sx={{ m: 1, minWidth: 120, margin: '0px', minHeight: 30, fontWeight: '700px',}}>
                                    <Select
                                        value={currentYear}
                                        onChange={yearChangeHandler}
                                        id="demo-simple-select-standard"
                                        sx={{
                                            border: '0px',
                                            fontFamily: 'Poppins',
                                            fontSize: '10px',
                                            position: 'relative'
                                        }}
                                    >
                                        {
                                            years?.map(year => 
                                                <MenuItem sx={{
                                                    fontFamily: 'Poppins',
                                                    fontSize: '10px',
                                                    position: 'relative',
                                                    margin: '0px',
                                                    fontWeight: '700px'
                                                }} value={parseInt(year)}>{year}</MenuItem>)
                                        }
                                    </Select>
                                </FormControl >
                            </div>
                        </div>
                    </div>
                </div>
                <div className="emissions-widget__data">
                    <div className="emissions-widget__emissions-data">
                        <div className="emissions-widget__col-1">
                            <div>
                                <span className="emissions-widget__total-emissions">{ currentEmissions.totalEmissions / 1000000 } </span>
                            </div>
                            {
                                canCalculateTrend && calculateTrend() != 0 &&
                                <div className="emissions-widget__emissions-trend" >
                                    { calculateTrend() > 0 ? <MdArrowDropUp className="emissions-widget__emissions-trend-icon-up"/> : <MdArrowDropDown className="emissions-widget__emissions-trend-icon-down"/>}
                                    <span className={ calculateTrend() > 0 ? "emissions-widget__emissions-trend-value-red" : "emissions-widget__emissions-trend-value-green"} >{ calculateTrend() > 0 ? `+${calculateTrend()}%` : `${calculateTrend()}%` }</span>
                                    <MdInfoOutline className="emissions-widget__icon trend-icon"/>
                                </div>
                            }
                        </div>
                        <div>
                            <span className="emissions-widget__emissions-description">Total GHG Emissions <br/> Mt CO2e</span>
                        </div>
                    </div>
                    <div className="emissions-widget__emissions-data land-sinks">
                        <div className="emissions-widget__col-1">
                            <div>
                                <span className="emissions-widget__total-landsinks">0.1</span>
                            </div>
                            <div className="emissions-widget__emissions-trend">
                                <MdInfoOutline className="emissions-widget__icon trend-icon"/>
                            </div>
                        </div>
                        <div>
                            <span className="emissions-widget__emissions-description">Land Use Sinks <br/> Mt CO2e</span>
                        </div>
                    </div>
                    <div className="emissions-widget__emissions-data data-per-capita">
                        <div className="icon-wrapper">
                            <MdOutlinePeopleAlt className="people-alt-icon"/>
                        </div>
                        <div>
                            <div className="emissions-widget__col-1">
                                <div className="emissions-widget__row">
                                    <div>
                                        <span className="emissions-widget__total-tonnes-pc">18.58</span>
                                        <span className="emissions-widget__emissions-pc-unit">T</span>
                                    </div>
                                </div>
                                <div className="emissions-widget__emissions-trend">
                                    <MdInfoOutline className="emissions-widget__icon trend-icon"/>
                                </div>
                            </div>
                            <div>
                                <div className="emissions-widget__emissions-description pc-text">Emissions</div>
                                <div className="emissions-widget__emissions-description pc-text">per capita</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="emissions-widget__methodologies">
                    <div className="emissions-widget__methodologies-heading">
                        <span>Methodologies</span>
                        <MdInfoOutline className="emissions-widget__icon methodologies-icon"/>
                    </div>
                    <div className="emissions-widget__methodologies-tags">
                        <div className="methodologies-tag">
                            <span className="methodologies-text">Remote sensing</span>
                        </div>
                        <div className="methodologies-tag">
                            <span className="methodologies-text">Machine Learning</span>
                        </div>
                        <div className="methodologies-tag overflow-handler">
                            <span className="methodologies-text">+2</span>
                        </div>
                    </div>
                </div>
            </div>:
            <div className="emissions-widget__wrapper">
                <div className="emissions-widget__metadata">
                    <div>
                        <div className='emissions-widget__metadata-inner'>
                            <span className='emissions-widget__title'>
                                Total emissions
                            </span>
                            <span>
                                <MdInfoOutline className="emissions-widget__icon"/>
                            </span>
                        </div>
                    </div>
                    <div className="emissions-widget__metadata-right">
                        <div className="emissions-widget__metadata-right-inner">
                            <div className='emissions-widget__source-label'>Source</div>
                            <div className='emissions-widget__source-title'>
                                <span>
                                    N/A
                                </span>
                                <MdArrowDropDown className="emissions-widget__icon arrow"/>
                            </div>
                        </div>
                        <div className="emissions-widget__metadata-right-inner">
                            <div className='emissions-widget__source-label'>Year</div>
                            <div className='emissions-widget__source-title'>
                                <span>
                                    N/A
                                </span>
                                <MdArrowDropDown className="emissions-widget__icon arrow"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="emissions-widget__data">
                    <div className="emissions-widget__emissions-data divider">
                        <div className="emissions-widget__col-1">
                            <div>
                                <span className="emissions-widget__total-emissions no-data">N/A</span>
                            </div>
                            <div className="emissions-widget__emissions-trend">
                                <MdInfoOutline className="emissions-widget__icon trend-icon"/>
                            </div>
                        </div>
                        <div>
                            <span className="emissions-widget__emissions-description no-data">Total GHG Emissions <br/> Mt CO2e</span>
                        </div>
                    </div>

                    <div className="emissions-widget__emissions-data data-per-capita marg">
                        <div className="icon-wrapper">
                            <MdOutlinePeopleAlt className="people-alt-icon"/>
                        </div>
                        <div>
                            <div className="emissions-widget__col-1">
                                <div className="emissions-widget__row">
                                    <div>
                                        <span className="emissions-widget__total-tonnes-pc no-data">N/A</span>
                                    </div>
                                </div>
                                <div className="emissions-widget__emissions-trend">
                                    <MdInfoOutline className="emissions-widget__icon trend-icon"/>
                                </div>
                            </div>
                            <div>
                                <div className="emissions-widget__emissions-description pc-text no-data">Emissions</div>
                                <div className="emissions-widget__emissions-description pc-text no-data">per capita</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="emissions-widget__methodologies">
                    <div className="emissions-widget__methodologies-heading">
                        <span>Methodology</span>
                        <MdInfoOutline className="emissions-widget__icon methodologies-icon"/>
                    </div>

                </div>
            </div>
            }
        </div>
    )
}

export default EmissionsWidget;
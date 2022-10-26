import {FunctionComponent, useEffect, useState} from 'react';
import './emissions-widget.scss';
import {MdInfoOutline, MdArrowDropDown, MdArrowDropUp, MdOutlinePeopleAlt} from "react-icons/md";
import {Select, MenuItem, SelectChangeEvent, FormControl} from '@mui/material';

interface Props {
    current: any,
    parent: any
}

const EmissionsWidget: FunctionComponent<Props> = (props) => {

    const {current, parent} = props;
    const emissionInfo = null

    const sources = (current && current.emissions) ? current.emissions.keys() : []

    sources.sort()

    const defaultSource = (sources.length > 0) ? sources[0] : null
    const defaultYear = (defaultSource && current.emissions[defaultSource].data.length > 0) ? current.emissions[defaultSource].data[0].year : null
    const latestYear = defaultYear

    const [currentSource, setCurrentSource] = useState<any>(defaultSource);
    const [currentYear, setCurrentYear] = useState<any>(defaultYear);

    const years = (currentSource) ? current.emissions[currentSource].data.map((e:any) => e.year) : []
    const currentEmissions = (currentSource && currentYear) ? current.emissions[currentSource].data.find((e:any) => e.year == currentYear) : null
    const lastEmissions = (currentSource && currentYear) ? current.emissions[currentSource].data.find((e:any) => e.year == currentYear - 1) : null
    const trend = (currentEmissions && lastEmissions) ? (currentEmissions.total_emissions - lastEmissions.total_emissions)/(lastEmissions.total_emissions) : 0

    const yearChangeHandler = (e: SelectChangeEvent<number>) => {
        const value = e.target.value as number;
        setCurrentYear(value);
    }

    const sourceChangeHandler = (e: SelectChangeEvent<number>) => {
        const value = e.target.value as number;
        setCurrentSource(value);
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
                        {
                            latestYear != 0 &&
                              <span className="emissions-widget__last-updated">{`Last updated in ${latestYear}`}</span>
                        }
                    </div>
                    <div className="emissions-widget__metadata-right">
                        <div className="emissions-widget__metadata-right-inner">
                            <div className='emissions-widget__source-label'>Source</div>
                            <div className='emissions-widget__source-title'>
                                <FormControl variant="standard" sx={{ m: 1, minWidth: 120, margin: '0px', minHeight: 30, fontWeight: '700px',}}>
                                    <Select
                                        value={currentSource}
                                        onChange={sourceChangeHandler}
                                        id="demo-simple-select-standard"
                                        sx={{
                                            border: '0px',
                                            fontFamily: 'Poppins',
                                            fontSize: '10px',
                                            position: 'relative'
                                        }}
                                    >
                                        {
                                            sources.map((source:any) =>
                                                <MenuItem sx={{
                                                    fontFamily: 'Poppins',
                                                    fontSize: '10px',
                                                    position: 'relative',
                                                    margin: '0px',
                                                    fontWeight: '700px'
                                                }} value={source}>{source}</MenuItem>)
                                        }
                                    </Select>
                                </FormControl >
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
                                            years?.map((year:any) =>
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
                                trend != 0 &&
                                <div className="emissions-widget__emissions-trend" >
                                    { trend > 0 ? <MdArrowDropUp className="emissions-widget__emissions-trend-icon-up"/> : <MdArrowDropDown className="emissions-widget__emissions-trend-icon-down"/>}
                                    <span className={ trend > 0 ? "emissions-widget__emissions-trend-value-red" : "emissions-widget__emissions-trend-value-green"} >{ trend > 0 ? `+${trend}%` : `${trend}%` }</span>
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
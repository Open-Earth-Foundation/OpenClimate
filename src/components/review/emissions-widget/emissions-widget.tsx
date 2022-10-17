import React, {useState} from 'react';
import './emissions-widget.scss';
import {MdInfoOutline, MdArrowDropDown, MdArrowDropUp, MdOutlinePeopleAlt} from "react-icons/md";

const EmissionsWidget = () => {
    const [data, setData] = useState<boolean>(true)

    return(
        <div className="emissions-widget" style={{height: data ? '': "268px"}}>
            {
                data ?
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
                        <span className="emissions-widget__last-updated">Last updated in 2018</span>
                    </div>
                    <div className="emissions-widget__metadata-right">
                        <div className="emissions-widget__metadata-right-inner">
                            <div className='emissions-widget__source-label'>Source</div>
                            <div className='emissions-widget__source-title'>
                                <span>
                                    Climate TRACE
                                </span> 
                                <MdArrowDropDown className="emissions-widget__icon arrow"/>
                            </div>
                        </div>
                        <div className="emissions-widget__metadata-right-inner">
                            <div className='emissions-widget__source-label'>Year</div>
                            <div className='emissions-widget__source-title'>
                                <span>
                                    2019
                                </span>
                                <MdArrowDropDown className="emissions-widget__icon arrow"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="emissions-widget__data">
                    <div className="emissions-widget__emissions-data">
                        <div className="emissions-widget__col-1">
                            <div>
                                <span className="emissions-widget__total-emissions">150.44</span>
                            </div>
                            <div className="emissions-widget__emissions-trend">
                                <MdArrowDropUp className="emissions-widget__emissions-trend-icon"/>
                                <span className="emissions-widget__emissions-trend-value">+12%</span>
                                <MdInfoOutline className="emissions-widget__icon trend-icon"/>
                            </div>
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
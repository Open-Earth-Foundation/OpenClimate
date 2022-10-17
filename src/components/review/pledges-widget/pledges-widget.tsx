import React, {useState} from 'react';
import './pledges-widget.scss';
import {MdInfoOutline, MdArrowDownward} from "react-icons/md";

const PledgesWidget = () => {
    const [data, setData] = useState<boolean>(true)
    return(
        <div className="pledges-widget" style={{height: data ? '': "268px"}}>
            {
                data ?
                <div className="pledges-widget__wrapper">
                    <div className="pledges-widget__metadata">
                        <div>
                            <div className='pledges-widget__metadata-inner'>
                                <span className='pledges-widget__title'>
                                    Pledges
                                </span>
                                <span>
                                    <MdInfoOutline className="pledges-widget__icon"/>
                                </span>
                            </div>
                            <span className="pledges-widget__last-updated">Last updated June 2020</span>
                        </div>
                    </div>
                    <div className="pledges-widget__pledges-data">
                        <div className="pledges-widget__pledge-entry">
                            <div className="pledges-widget__pledge-source">
                                <span>CDP</span>
                            </div>
                            <div className="pledges-widget__pledge-source-info">
                                <div className="pledges-widget__pledge-type">
                                    CARBON INTENSITY
                                </div>
                                <div className="pledges-widget__pledge-target">
                                    <div className="pledges-widget__percentage-value">
                                        <MdArrowDownward className="pledges-widget__percentage-arrow"/>
                                        <span className="pledges-widget__percentage-value-number">30%</span>
                                    </div>
                                    <div className="pledges-widget__target-estimate">
                                        <div>by 2030 relative</div> 
                                        <div>to 2005</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pledges-widget__pledge-entry">
                            <div className="pledges-widget__pledge-source">
                                <span>CDP</span>
                            </div>
                            <div className="pledges-widget__pledge-source-info">
                                <div className="pledges-widget__pledge-type">
                                    CARBON INTENSITY
                                </div>
                                <div className="pledges-widget__pledge-target">
                                    <div className="pledges-widget__percentage-value">
                                        <MdArrowDownward className="pledges-widget__percentage-arrow"/>
                                        <span className="pledges-widget__percentage-value-number">50%</span>
                                    </div>
                                    <div className="pledges-widget__target-estimate">
                                        <div>by 2025 relative</div> 
                                        <div>to 2018</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pledges-widget__pledge-entry">
                            <div className="pledges-widget__pledge-source">
                                <span>CDP</span>
                            </div>
                            <div className="pledges-widget__pledge-source-info">
                                <div className="pledges-widget__pledge-type">
                                    CARBON INTENSITY
                                </div>
                                <div className="pledges-widget__pledge-target">
                                    <div className="pledges-widget__percentage-value">
                                        <MdArrowDownward className="pledges-widget__percentage-arrow"/>
                                        <span className="pledges-widget__percentage-value-number">0</span>
                                    </div>
                                    <div className="pledges-widget__target-estimate">
                                        <div className='target-text'>by 2025</div> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>: 
                <div className="pledges-widget__wrapper">
                    <div className="pledges-widget__metadata">
                        <div>
                            <div className='pledges-widget__metadata-inner'>
                                <span className='pledges-widget__title'>
                                    Pledges
                                </span>
                                <span>
                                    <MdInfoOutline className="pledges-widget__icon"/>
                                </span>
                            </div>
                            <span className="pledges-widget__last-updated">Last updated:</span>
                        </div>
                    </div>
                    <div className="pledges-widget__pledges-data no-data">
                        <span>No data available</span>
                    </div>
                </div>
            }
        </div>
    )
}

export default PledgesWidget;
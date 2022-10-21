import React, {useState, FunctionComponent} from 'react';
import './pledges-widget.scss';
import {MdInfoOutline, MdArrowDownward} from "react-icons/md";
import IPledge from '../../../api/models/DTO/Pledge/IPledge';
import PledgeItem from './pledge-item';

interface Props {
    pledgesData: Array<IPledge>
}

const PledgesWidget: FunctionComponent<Props> = (props) => {

    const {pledgesData} = props;

    
    return(
        <div className="pledges-widget" style={{height: pledgesData ? '': "268px"}}>
            {
                pledgesData.length ?
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
                    { pledgesData.map(pledge =>
                        <PledgeItem pledge={pledge} />

                    )}
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
                            <span className="pledges-widget__last-updated"></span>
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
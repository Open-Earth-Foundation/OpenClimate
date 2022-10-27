import React, {useState, FunctionComponent} from 'react';
import './pledges-widget.scss';
import {MdInfoOutline, MdArrowDownward} from "react-icons/md";
import PledgeItem from './pledge-item';

interface Props {
    current: any,
    parent: any
}

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"]

const PledgesWidget: FunctionComponent<Props> = (props) => {

    const {current, parent} = props;
    const targets = (current && current.targets) ? current.targets : []
    const lu = targets.map((t:any) => t.last_updated)
    lu.sort()
    const lastUpdated = (lu.length > 0) ? lu[lu.length - 1] : null
    const [lastMonth, lastYear] = (lastUpdated) ? [(new Date(lastUpdated)).getMonth(), (new Date(lastUpdated)).getFullYear()] : [null, null]

    return(
        <div className="pledges-widget" style={{height: targets ? '': "268px"}}>
            {
                targets?.length ?
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
                            {
                                lastUpdated &&
                                  <span className="pledges-widget__last-updated">Last updated {lastMonth != null && monthNames[lastMonth]} {lastYear}</span>
                            }
                        </div>
                    </div>
                    { targets?.map((pledge:any) =>
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
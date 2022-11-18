import React, {useState, FunctionComponent} from 'react';
import './pledges-widget.scss';
import {MdInfoOutline, MdArrowDownward} from "react-icons/md";
import { Boy, AspectRatio, InfoOutlined, MonetizationOnOutlined } from '@mui/icons-material'
import Diversity3Icon from '@mui/icons-material/Diversity3';

import PledgeItem from './pledge-item';

import { makeStyles } from "@material-ui/core/styles";
import Tooltip from '@mui/material/Tooltip';


interface Props {
    current: any,
    parent: any
}

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"]

const PledgesWidget: FunctionComponent<Props> = (props) => {

    const {current, parent} = props;

    const useStyles = makeStyles(() => ({
        customTooltip: {
          backgroundColor: "rgba(44, 44, 44, 1)",
          padding: "10px"
        },
        customArrow: {
          color: "rgba(44, 44, 44, 1)"
        }
      }));

    const classes = useStyles();
    const targets = (current && current.targets) ? current.targets : []
    const lu = targets.map((t:any) => t.last_updated)
    lu.sort()
    const lastUpdated = (lu.length > 0) ? lu[lu.length - 1] : null
    const [lastMonth, lastYear] = (lastUpdated) ? [(new Date(lastUpdated)).getMonth(), (new Date(lastUpdated)).getFullYear()] : [null, null]

    
    return(
        <div className="pledges-widget" style={{height: targets.length ? '': "268px"}}>
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
                                <Tooltip 
                                    classes={{
                                                tooltip: classes.customTooltip,
                                                arrow: classes.customArrow
                                            }}
                                    title= {
                                                <div className = "tooltip">
                                                    Commitments that the selected actor made
                                                </div>
                                           } 
                                    arrow placement="right">
                                        <InfoOutlined className="pledges-widget__icon info-icon" />
                                </Tooltip>
                                    
                                </span>
                            </div>
                            {
                                lastUpdated &&
                                  <span className="pledges-widget__last-updated">Last updated {lastMonth != null && monthNames[lastMonth]} {lastYear}</span>
                            }
                        </div>
                    </div>
                    { targets?.map((pledge:any, index: number) =>
                        <PledgeItem pledge={pledge} key={`pledge-item-${index}`} />
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
                                <Tooltip 
                                    classes={{
                                                tooltip: classes.customTooltip,
                                                arrow: classes.customArrow
                                            }}
                                    title= {
                                                <div className = "tooltip">
                                                    Commitments that the selected actor made
                                                </div>
                                           } 
                                    arrow placement="right">
                                        <InfoOutlined className="pledges-widget__icon info-icon" />
                                </Tooltip>
                                </span>
                            </div>
                            <span className="pledges-widget__last-updated"></span>
                        </div>
                    </div>
                    <div className="pledges-widget__pledges-data no-data">
                        <div className="pledges-widget__pledges-empty-state">
                            
                            <p>There's no data available, if you have any suggested <br /> data sources or you are a provider please</p>
                            
                            <button className="collaborate-cta-btn">
                                <Diversity3Icon className="collaborate-cta-icon"/>
                                <span>COLLABORATE WITH DATA</span>
                            </button>

                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default PledgesWidget;
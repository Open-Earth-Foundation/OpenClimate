import { withWidth } from '@material-ui/core';
import React, { FunctionComponent } from 'react'
import { NavLink } from 'react-router-dom';

import './emission.widget.scss';
import IAggregatedEmission from '../../../../api/models/DTO/AggregatedEmission/IAggregatedEmission';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface Props {
    isVisible: boolean
    title?: string,
    height?: number,
    width?: number,
    className?: string,
    detailsLink?: string,
    totalGhg?: number,
    landSinks?: number,
    year?: number,
    lastupdated?: string,
    source?: string,
    methodology?: string,
    aggregatedEmission?: IAggregatedEmission | null,
    detailsClick?: () => void

}

const EmissionWidget: FunctionComponent<Props> = (props) => {

    const { title, className, width, height, detailsLink, aggregatedEmission,totalGhg, isVisible,  detailsClick, landSinks } = props;

    if(!isVisible)
        return null;


    let showDetails = false;
    if(aggregatedEmission)
        showDetails = aggregatedEmission.facility_ghg_total_gross_co2e !== 0 ||
                      aggregatedEmission.facility_ghg_total_sinks_co2e !== 0 ||
                      aggregatedEmission.facility_ghg_total_net_co2e !== 0;

    return (
        <div className="widget" >
            <div className="widget__wrapper" >
                <div className="widget__header">
                    <div className="widget__title-wrapper">
                        <h3 className="widget__title">
                            {title}
                        </h3> 
                        {
                            showDetails || detailsClick ?
                            <>
                            {detailsLink ?
                                <NavLink to={detailsLink} className="widget__link">Details</NavLink>
                                :
                                <a href="#" className="widget__link" onClick={detailsClick}>See details</a>         
                            }
                            </>
                            : ''
                        }

                    </div>

                    <span className="widget__updated">Last Updated June {props.lastupdated} | Data shown refers to {props.year}</span>     

                </div>
                <div className="widget__content" style={{height: `auto`}}>
                    {
                    totalGhg ? 
                    <div className={`widget__emission-content ${className}`}>
                            <div className={'widget__emission-block'}>
                                <div className="widget__emission-data red">
                                    {totalGhg}
                                    
                                </div>
                                <div className="widget__emission-data-description">Total GHG Emissions
                                </div>
                                <div className="widget__emission-data-description">Mmt CO2e/year</div>
                            </div>
                            { landSinks && landSinks > 0 && 
                                <div className={`widget__emission-numbers widget__emission-block`}>
                                    <div className="widget__emission-data-small green">
                                        {/* {aggregatedEmission?.facility_ghg_total_sinks_co2e?.toFixed(2)} */} 0
                                    </div>
                                    <div className="widget__emission-data-description">Land Use Sinks Mt CO2e/year</div>
                                </div>
                            }
                            <div className='widget__meta-data'>
                                <div className='widget__meta-text'>
                                    <span className='widget__meta-source-head'>Source</span>
                                    <div className='widget__meta-source-name'><span>{props.source}</span> <ArrowDropDownIcon fontSize='inherit'/></div>
                                    
                                </div>
                                <div className='widget__meta-text'>
                                    <span className='widget__meta-source-head'>Methodology</span>
                                    { props.methodology && <span className='widget__meta-source-m'>{props.methodology}</span> }
                                </div>
                            </div>
                    </div>
                    : 
                    <div className="widget__no-data">
                        No data sourced yet. Have any suggestions, contact ux@openearth.org!
                    </div>
                    }
                </div>
            </div>
        </div>
    );
}


export default EmissionWidget;

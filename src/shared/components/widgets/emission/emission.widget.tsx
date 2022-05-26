import { withWidth } from '@material-ui/core';
import React, { FunctionComponent } from 'react'
import { NavLink } from 'react-router-dom';
import ArrowUp from '../../../img/widgets/arrow_up_red.svg';
import ArrowUpRed from '../../../img/widgets/arrow_up_red.svg';
import ArrowDownGreen from '../../../img/widgets/arrow_down_green.svg';
import './emission.widget.scss';
import IAggregatedEmission from '../../../../api/models/DTO/AggregatedEmission/IAggregatedEmission';

interface Props {
    isVisible: boolean
    title?: string,
    height?: number,
    width?: number,
    className?: string,
    detailsLink?: string,
    aggregatedEmission?: IAggregatedEmission,
    detailsClick?: () => void
}

const EmissionWidget: FunctionComponent<Props> = (props) => {

    const { title, className, width, height, detailsLink, aggregatedEmission, isVisible,  detailsClick } = props;

    if(!isVisible)
        return null;


    let showDetails = false;
    if(aggregatedEmission)
        showDetails = aggregatedEmission.facility_ghg_total_gross_co2e !== 0 ||
                      aggregatedEmission.facility_ghg_total_sinks_co2e !== 0 ||
                      aggregatedEmission.facility_ghg_total_net_co2e !== 0;

    return (
        <div className="widget" style={{width: width, height: height}}>
            <div className="widget__wrapper" >
                <div className="widget__header">
                    <div className="widget__title-wrapper">
                        <h3 className="widget__title">
                            {title}
                        </h3> 
                        {
                            showDetails ?
                            <>
                            {detailsLink ?
                                <NavLink to={detailsLink} className="widget__link">Details</NavLink>
                                :
                                <a href="#" className="widget__link" onClick={detailsClick}>Details</a>         
                            }
                            </>
                            : ''
                        }

                    </div>

                    <span className="widget__updated">Last Updated June 2020</span>     

                </div>
                <div className="widget__content" style={{height: `calc(${height}px - 90px)`}}>
                    {
                    aggregatedEmission ? 
                    <div className={`widget__emission-content ${className}`}>
                        <div className="widget__emission-numbers">
                            <div className="widget__content-column">
                                <div className="widget__emission-data red">
                                    <img src={ArrowUpRed} alt="up" className="widget__emission-arrow"/>
                                    {aggregatedEmission?.facility_ghg_total_gross_co2e?.toFixed(2)}
                                    {/* 102365.00 */}
                                </div>
                                <div className="widget__emission-data-description">
                                    Total GHG Emissions Mmt CO2e/year
                                </div>
                            </div>
                            <div className="widget__content-column widget__content-column_center">-</div>
                            <div className="widget__content-column">
                                <div className="widget__emission-data green">
                                    <img src={ArrowDownGreen} alt="down" className="widget__emission-arrow" />
                                    {aggregatedEmission?.facility_ghg_total_sinks_co2e?.toFixed(2)}
                                </div>
                                <div className="widget__emission-data-description">Land Use Sinks Mt CO2e/year</div>
                            </div>
                            <div className="widget__content-column widget__content-column_center">=</div>
                            <div className="widget__content-column red">
                                <div className="widget__emission-data">{aggregatedEmission?.facility_ghg_total_net_co2e?.toFixed(2)}</div>
                                <div className="widget__emission-data-description">Net GHG Emissions Mt CO2e/year</div>
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

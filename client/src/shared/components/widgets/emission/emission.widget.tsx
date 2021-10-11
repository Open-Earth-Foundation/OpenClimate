import { withWidth } from '@material-ui/core';
import React, { FunctionComponent } from 'react'
import { NavLink } from 'react-router-dom';
import IEmission from '../../../../api/models/review/entity/emission';
import ArrowUp from '../../../img/widgets/arrow_up_red.svg';
import ArrowUpRed from '../../../img/widgets/arrow_up_red.svg';
import ArrowDownGreen from '../../../img/widgets/arrow_down_green.svg';
import './emission.widget.scss';

interface Props {
    title?: string,
    emissionData?: IEmission,
    height?: number,
    width?: number,
    className?: string,
    detailsLink?: string,
    detailsClick?: () => void
}

const EmissionWidget: FunctionComponent<Props> = (props) => {

    const { title, emissionData, className, width, height, detailsLink, detailsClick } = props;

    return (
        <div className="widget" style={{width: width, height: height}}>
            <div className="widget__wrapper" >
                <div className="widget__header">
                    <div className="widget__title-wrapper">
                        <h3 className="widget__title">
                            {title}
                        </h3> 
                        {detailsLink ?
                            <NavLink to={detailsLink} className="widget__link">Details</NavLink>
                            :
                            <a href="#" className="widget__link" onClick={detailsClick}>Details</a>         
                        }
                    </div>

                    <span className="widget__updated">Last Updated June 2020</span>     

                </div>
                <div className="widget__content" style={{height: `calc(${height}px - 90px)`}}>
                    {
                    emissionData ? 
                    <div className={`widget__emission-content ${className}`}>
                        <div className="widget__emission-numbers">
                            <div className="widget__content-column">
                                <div className="widget__emission-data red">
                                    <img src={ArrowUpRed} alt="up" className="widget__emission-arrow"/>
                                    {emissionData?.totalGrossEmissions.toFixed(2)}
                                </div>
                                <div className="widget__emission-data-description">
                                    Total GHG Emissions Mmt CO2e/year
                                </div>
                                        </div>
                                        <div className="widget__content-column widget__content-column_center">-</div>
                                        <div className="widget__content-column">
                                            <div className="widget__emission-data green">
                                                <img src={ArrowDownGreen} alt="down" className="widget__emission-arrow" />
                                                {emissionData?.landUseSinks.toFixed(2)}
                                            </div>
                                            <div className="widget__emission-data-description">Land Use Sinks
                        Mt CO2e/year</div>
                                        </div>
                                        <div className="widget__content-column widget__content-column_center">=</div>
                                        <div className="widget__content-column red">
                                            <div className="widget__emission-data">{emissionData?.totalNetEmissions.toFixed(2)}</div>
                                            <div className="widget__emission-data-description">Net GHG Emissions
                        Mt CO2e/year</div>
                            </div>
                        </div>
                    </div>
                    : 
                    <div className="widget__no-data">
                        No any data
                    </div>
                    }
                </div>
            </div>
        </div>
    );
}


export default EmissionWidget;

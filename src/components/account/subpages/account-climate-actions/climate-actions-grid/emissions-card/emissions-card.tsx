import React, { FunctionComponent, useEffect, useState } from 'react'
import EmissionsGrid from '../emissions-grid/emissions-grid';
import EmptyIcon from '../../../../img/empty-icon.png';
import './emissions-card.scss';
import IClimateAction from '../../../../../../api/models/DTO/ClimateAction/IClimateAction';
import { ClimateActionTypes } from '../../../../../../api/models/DTO/ClimateAction/climate-action-types';

interface IProps  {
    cardTitle: string,
    climateActions: Array<IClimateAction>
}

const EmissionsCard: FunctionComponent<IProps> = (props) => {

    const { cardTitle, climateActions } = props;
    
    const [ totalAmount, setTotalAmount ] = useState(0);
    
    useEffect(() => {

        const amount = climateActions.reduce((a: number, n: IClimateAction) => {

            const value = n.climate_action_type?.toString() == ClimateActionTypes[ClimateActionTypes.Mitigations] ? 
                -Math.abs(n.facility_mitigations_co2e ?? 0) : Math.abs(n.facility_emissions_co2e ?? 0);

            return a += value ? Number(value) : 0;
        }, 0);

        setTotalAmount(amount);

    }, [climateActions]);


    return (
        <div className="emissions-card">
            <div className="emissions-card__content">
                <div className="emissions-card__header">
                    <div className="emissions-card__icon">
                        <img src={EmptyIcon} alt="icon" />
                    </div>
                    <div className="emissions-card__title">
                        <h3>{cardTitle}</h3>
                        <span className="emissions-card__header-date">Last updated June 2020</span>
                    </div>
                </div>
                <div className="emissions-card__data">
                    <div className="emissions-card__description">
                        Greenhouse gas emissions from the clearing and burning forests, scrublands and savannahs by fire and other methods or removal
                    </div>
                    <div className="emissions-card__total-amount">
                        <div className={`emissions-card__amount ${totalAmount > 0 ? 'amount-red' : 'amount-green'}`}>{totalAmount}</div>
                        <span className="emissions-card__total-amount-description">Mt CO2e/year</span>
                    </div>

                </div>
            </div>
            <EmissionsGrid climateActions={climateActions} />

        </div>
    );
}

export default EmissionsCard;
 /*
                     <div className="emissions-card__ranking">
                        <div className="emissions-card__ranking-row">
                            <span className="emissions-card__ranking-number">20%</span>
                            Of Total Global Emissions
                        </div>
                        <div className="emissions-card__ranking-row">
                        <span className="emissions-card__ranking-number">1st</span>
                            Leading Contributor
                        </div>
                    </div>
 */
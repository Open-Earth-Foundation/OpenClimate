import { FunctionComponent, useEffect, useState } from 'react'
import { ClimateActionTypes } from '../../../../../../api/models/DTO/ClimateAction/climate-action-types';
import EmissionsGrid from '../emissions-grid/emissions-grid';
import EmptyIcon from '../../../../img/empty-icon.png';
import IClimateAction from '../../../../../../api/models/DTO/ClimateAction/IClimateActions/IClimateAction';
import './emissions-card.scss';
import IEmissions from '../../../../../../api/models/DTO/ClimateAction/IClimateActions/IEmissions';
import IMitigations from '../../../../../../api/models/DTO/ClimateAction/IClimateActions/IMitigations';

interface IProps  {
    cardTitle: string,
    climateActions: Array<IClimateAction>
}

const EmissionsCard: FunctionComponent<IProps> = (props) => {

    const { cardTitle, climateActions } = props;
    
    const [ totalAmount, setTotalAmount ] = useState(0);
    
    useEffect(() => {

        const amount = climateActions.reduce((a: number, n: IClimateAction) => {

            let value = 0;
            if(n.climate_action_type)
            {
                const cType = ClimateActionTypes[n.climate_action_type as keyof typeof ClimateActionTypes];

                if(cType === ClimateActionTypes.Emissions)
                    value = Math.abs((n as IEmissions)?.facility_emissions_co2e ?? 0);
                else
                    value = -Math.abs((n as IMitigations).facility_mitigations_co2e ?? 0);

                
            }

           /* const value = n.climate_action_type?.toString() == ClimateActionTypes[ClimateActionTypes.Mitigations] ? 
                -Math.abs(n.facility_mitigations_co2e ?? 0) : Math.abs(n.facility_emissions_co2e ?? 0);*/

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
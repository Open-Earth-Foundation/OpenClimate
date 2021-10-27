import React, { FunctionComponent, useEffect } from 'react'
import './emissions-grid-row.scss';
import CheckIcon from '../../../../../img/check.png';
import CloseIcon from '../../../../../img/close.png';
import TimeLineIcon from '../../../../../img/timeline.png';
import IClimateAction from '../../../../../../../api/models/DTO/ClimateAction/IClimateAction';
import { ClimateActionTypes } from '../../../../../../../api/models/DTO/ClimateAction/climate-action-types';
import { ClimateActionVerified } from '../../../../../../../api/models/DTO/ClimateAction/climate-action-verified';
import Moment from 'moment'

interface IProps  {
    date?: string,
    timeline?: boolean,
    climateAction: IClimateAction
}

const EmissionsGridRow: FunctionComponent<IProps> = (props) => {

    const { climateAction, timeline } = props;

    const useTimeline = timeline ? timeline : false;

    const cActionType = climateAction.climate_action_type?.toString();
    const amount = cActionType == ClimateActionTypes[ClimateActionTypes.Mitigations] ?
        climateAction.facility_mitigations_co2e : climateAction.facility_emissions_co2e;

    const verified = climateAction.verification_result?.toString() == ClimateActionVerified[ClimateActionVerified.Verified];

    const emmisionTitle = cActionType == ClimateActionTypes[ClimateActionTypes.Mitigations] ?
        'Mitigations' : 'Emissions';

    const colorClass = cActionType == ClimateActionTypes[ClimateActionTypes.Mitigations] ?
        'amount-green' : 'amount-red';

    return (
        <div className="emission-row">
            {useTimeline ? 
            <div className="emission-row__timeline">
                <img src={TimeLineIcon} alt="timeline" className="" />
            </div>
            : ""
            }
            <div className="emission-row__content">
                {useTimeline ? 
                <div className="emission-row__timeline-date">
                    09:30 PM June 2019
                </div>
                : ""
                }

                <div className="emission-row__data">
                    <div className={`emission-row__emission-amount scope-item-amount ${colorClass}`}>
                        {amount}
                    </div>
                    <div className="emission-row__title">
                        {emmisionTitle} <br/>
                        Mt CO2e/year
                    </div>

                    <div className="emission-row__scope">
                        <button className="emission-row__btn scope-item-btn scope-item-btn_blue">
                            {climateAction.climate_action_scope}
                        </button>
                    </div>
                    <div className="emission-row__signed-by ">
                        <span className="scope-item-signedby-header">Signed By</span>
                        <span className="scope-item-signedby">{climateAction.organization_name}</span> 
                        {useTimeline ? "" : 
                         <span className="scope-item-signed-date">
                            {Moment(climateAction.credential_issue_date).format('MMM DD yyyy')}
                         </span>
                        }
                    </div>

                    <div className="emission-row__verified scope-item-verified">
                        {verified  ?
                            <React.Fragment>
                                <img src={CheckIcon} alt="verified" className="scope-verified-icon" />
                                {climateAction.verification_result} by {climateAction.verification_body}
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <img src={CloseIcon} alt="unverified" className="scope-verified-icon" />
                                {climateAction.verification_result}
                            </React.Fragment>
                        }
                    </div>
                </div>
            </div>
            
        </div>


    );
}

export default EmissionsGridRow;
/*
                    <div className="emission-row__description">
                        {climateAction.facility_type}
                    </div>
*/
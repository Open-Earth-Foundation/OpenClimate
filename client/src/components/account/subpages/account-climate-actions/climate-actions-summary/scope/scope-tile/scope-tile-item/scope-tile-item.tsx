import React, { FunctionComponent, useEffect, useState } from 'react'
import { ClimateActionScopes } from '../../../../../../../../api/models/DTO/ClimateAction/climate-action-scopes';
import { ClimateActionTypes } from '../../../../../../../../api/models/DTO/ClimateAction/climate-action-types';
import { ClimateActionVerified } from '../../../../../../../../api/models/DTO/ClimateAction/climate-action-verified';
import IClimateAction from '../../../../../../../../api/models/DTO/ClimateAction/IClimateAction';
import { ClimateActionHelper } from '../../../../../../../../shared/helpers/climate-action.helper';
import VerifiedIcon from '../../../../../../img/check.png';
import UnverifiedIcon from '../../../../../../img/unverified.svg';
import './scope-tile-item.scss';

interface IProps  {
    climateAction: IClimateAction,
    scope: ClimateActionScopes,
    fontSize?: number,
    titleAmount? : string
}

const ScopeTileItem: FunctionComponent<IProps> = (props) => {

    const { climateAction, scope, fontSize, titleAmount } = props;

    const [amount, setAmount] = useState(0);
    const [verified, setVerified] = useState(false);

    useEffect(()=>{
        if(climateAction) {
            const prop = ClimateActionHelper.GetPropByScope(scope);
            const a = (climateAction as any)[prop]
            if(a)
                setAmount(a);

            if(climateAction.verification_result && climateAction.verification_result === ClimateActionVerified[ClimateActionVerified.Verified])
                setVerified(true);
        }

    }, [climateAction]);

    let color = 'red';
    if(climateAction)
        color = climateAction.climate_action_type?.toString() == ClimateActionTypes[ClimateActionTypes.Mitigations] ? 'green' : 'red';

    return (
        <div className="scope-tile__signed-item">
            <div className="scope-tile__header">
                <div className="scope-tile__amount scope-item-amount" style={{fontSize: fontSize, color: color}}>{amount ? amount : ''}</div>
                {titleAmount ? 
                <div className="scope-tile__amount amount-title">{titleAmount}</div>
                : ""
                }
            </div>

           <div className="scope-tile__content">
                 <div className="scope-tile__content-header scope-item-signedby-header">Signed by</div>
                <div className="scope-tile__signed-by scope-item-signedby">{climateAction?.signature_name}</div>        
                <div className="scope-tile__signed-footer">
                    <div className="scope-tile__signed-date scope-item-signed-date">June 01 2019</div>
                    <div className="scope-tile__verified scope-item-verified">
                        {
                            verified ?
                            <>
                                <img src={VerifiedIcon} alt="verified" className="scope-verified-icon" />
                                <span> Verified by {climateAction.verification_body} </span>
                            </>
                            : 
                            <>
                                <img src={UnverifiedIcon} alt="not verified" className="scope-verified-icon" />
                                <span> Unverified </span>
                            </>
                        }
                    </div>
                </div>
           </div>
        </div>
    );
}

export default ScopeTileItem;
 
import React, { FunctionComponent } from 'react'
import { PledgesWidgetTarget } from '../../../../../api/data/shared/pledges-widget-target';
import IPledge from '../../../../../api/models/DTO/Pledge/IPledge';
import ArrowDownGreen from '../../../../img/widgets/arrow_down_green.svg';

import './pledge-item.scss';

interface Props {
    pledge: IPledge,
    voluntary: boolean
}

const PledgeItem: FunctionComponent<Props> = (props) => {

    const { pledge, voluntary } = props;

    const voluntaryStr = voluntary ? " Voluntary" : "Nationally Determined Contribution (NDC)";

    //let reduction = pledge.pledge_emission_reduction ?? 0;
    let pledgeTarget = "";
    let reductionStr = "";

    switch (pledge.credential_type) {
        case  "Target Emission Level Pledge":
            pledgeTarget = "EMISSION TARGET";
            reductionStr = `${pledge.pledge_emission_target ?? 0}`;
            break;
        case  "Target Carbon Intensity Level Pledge":
            pledgeTarget = "CARBON INTENSITY TARGET";
            reductionStr = `${pledge.pledge_carbon_intensity_target ?? 0}`;
            break;
        case  "Target Emission Reduction Pledge":
            pledgeTarget = "EMISSION REDUCTION";
            reductionStr = `${pledge.pledge_emission_reduction ?? 0} %`;
            break;
        case  "Target Carbon Intensity Reduction Pledge":
            pledgeTarget = "CARBON INTENSITY REDUCTION";
            reductionStr = `${pledge.pledge_carbon_intensity_reduction ?? 0} %`;
            break;
        default:
            pledgeTarget = "GHG emissions";
            reductionStr = `${pledge.pledge_emission_reduction ?? 0} %`;
            break;
    }

    return (
        <div className="review-tile__pledge">
            <div className="review-tile__pledge-title">{voluntaryStr}</div>
            <div className="review-tile__pledge-data">
                <div className="review-tile__pledge-data-name grey5">{pledgeTarget}</div>
                <div className="review-tile__pledge-data-percentage">
                    <img src={ArrowDownGreen} alt="reduction" className="review-tile__pledge_arrow"/>
                    {reductionStr}
                </div>
                <div className="review-tile__pledge-data-deadline"> 
                    {pledge.pledge_target_year ?
                    <>by {pledge.pledge_target_year} <br/></>
                    : ""
                    }
                    {pledge.pledge_base_year ? 
                        <>relative to {pledge.pledge_base_year}</>
                        : ""
                    }
                </div>
            </div>
        </div>
    );
}


export default PledgeItem;

/*
{`${pledge.goal}%`}
by {pledge.goalBy.getFullYear()} relative to {pledge.relativeTo.getFullYear()}

relative to {pledge.relativeTo.getFullYear()}
*/
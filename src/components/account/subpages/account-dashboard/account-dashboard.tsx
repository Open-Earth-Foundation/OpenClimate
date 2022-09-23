import React, { FunctionComponent, useEffect, useState } from 'react'
import IAggregatedEmission from '../../../../api/models/DTO/AggregatedEmission/IAggregatedEmission';
import { ClimateActionScopes } from '../../../../api/models/DTO/ClimateAction/climate-action-scopes';
import { ClimateActionTypes } from '../../../../api/models/DTO/ClimateAction/climate-action-types';
import IClimateAction from '../../../../api/models/DTO/ClimateAction/IClimateAction';
import ISite from '../../../../api/models/DTO/Site/ISite';
import { IUser } from '../../../../api/models/User/IUser';
import EmissionWidget from '../../../../shared/components/widgets/emission/emission.widget';
import PledgesWidget from '../../../../shared/components/widgets/pledges/pledges.widget';
import ReportsWidget from '../../../../shared/components/widgets/reports/reports.widget';
import SitesMapWidget from '../../../../shared/components/widgets/sites-map/sites-map.widget';
import { AggregatedEmissionHelper } from '../../../../shared/helpers/aggregated-emission.helper';
import { ClimateActionHelper } from '../../../../shared/helpers/climate-action.helper';
import './account-dashboard.scss';


interface IProps  {
    user: IUser, 
    aggregatedEmissions?: Array<IAggregatedEmission>,
    pledges?: Array<any>,
    sites?: Array<ISite>,
    climateActions?: Array<IClimateAction>
    showModal: (entityType: string) => void
}

const AccountDashboard: FunctionComponent<IProps> = (props) => {

    const { aggregatedEmissions, pledges, sites,climateActions, user, showModal} = props;

    const [ summaryEmissions, setSummaryEmissions] = useState<IAggregatedEmission>();
    
    let widgetPledges = [];
    if(pledges)
        widgetPledges = pledges.slice(Math.max(pledges.length - 3, 0)).reverse();
    

    useEffect(() => {
        if(aggregatedEmissions?.length == 0)
        {
            const scope1EmsActions = ClimateActionHelper.GetClimateActions(climateActions, ClimateActionScopes.Scope1 , ClimateActionTypes.Emissions);
            const scope1EmsTotal = ClimateActionHelper.GetSumC02(scope1EmsActions, 'facility_emissions_co2e');

            const scope2EmsActions = ClimateActionHelper.GetClimateActions(climateActions, ClimateActionScopes.Scope2 , ClimateActionTypes.Emissions);
            const scope2EmsTotal = ClimateActionHelper.GetSumC02(scope2EmsActions, 'facility_emissions_co2e');

            const scope3EmsActions = ClimateActionHelper.GetClimateActions(climateActions, ClimateActionScopes.Scope3 , ClimateActionTypes.Emissions);
            const scope3EmsTotal = ClimateActionHelper.GetSumC02(scope3EmsActions, 'facility_emissions_co2e');

            const scope1MtsActions = ClimateActionHelper.GetClimateActions(climateActions, ClimateActionScopes.Scope1 , ClimateActionTypes.Mitigations);
            const scope1MtsTotal = ClimateActionHelper.GetSumC02(scope1MtsActions, 'facility_mitigations_co2e');

            const scope2MtsActions = ClimateActionHelper.GetClimateActions(climateActions, ClimateActionScopes.Scope2 , ClimateActionTypes.Mitigations);
            const scope2MtsTotal = ClimateActionHelper.GetSumC02(scope2MtsActions, 'facility_mitigations_co2e');

            const scope3MtsActions = ClimateActionHelper.GetClimateActions(climateActions, ClimateActionScopes.Scope3 , ClimateActionTypes.Mitigations);
            const scope3MtsTotal = ClimateActionHelper.GetSumC02(scope3MtsActions, 'facility_mitigations_co2e');

            const totalScopeEmissions = scope1EmsTotal + scope2EmsTotal + scope3EmsTotal; 
            const totalScopeMitigations = scope1MtsTotal + scope2MtsTotal + scope3MtsTotal;

            const em: IAggregatedEmission = {
                credential_category: "Climate Action",
                facility_ghg_total_net_co2e: 500,
                facility_ghg_total_gross_co2e:totalScopeEmissions,
                facility_ghg_total_sinks_co2e:totalScopeMitigations,
            }
            setSummaryEmissions(em)
        }
        else{
            const summaryAggr = AggregatedEmissionHelper.GetSummaryAggregatedEmissions(aggregatedEmissions);
            setSummaryEmissions(summaryAggr);
        }
    }, [aggregatedEmissions, climateActions]);

    return (
        <div className="account-dasboard">
            <SitesMapWidget 
                sites={sites}
                detailsLink="account/sites"
            />
            <div className='account-cards'>
                <EmissionWidget
                    isVisible={true}
                    title="Climate actions"
                    height={300}
                    // width={550}
                    detailsLink="account/climate-actions"
                    aggregatedEmission={summaryEmissions}
                />
                <PledgesWidget
                    pledges={widgetPledges} 
                    detailsLink="account/pledges"
                    showModal={showModal}
                    showAddBtn={!user.demo}
                    voluntary={true}
                />
            </div>
        </div>
    );
}

export default AccountDashboard;

import React, { FunctionComponent, useEffect, useState } from 'react'
import IAggregatedEmission from '../../../../api/models/DTO/AggregatedEmission/IAggregatedEmission';
import ISite from '../../../../api/models/DTO/Site/ISite';
import { IUser } from '../../../../api/models/User/IUser';
import ClimateAccountabilityWidget from '../../../../shared/components/widgets/climate-accountability/climate-accountability.widget';
import EmissionWidget from '../../../../shared/components/widgets/emission/emission.widget';
import PledgesWidget from '../../../../shared/components/widgets/pledges/pledges.widget';
import ReportsWidget from '../../../../shared/components/widgets/reports/reports.widget';
import SitesMapWidget from '../../../../shared/components/widgets/sites-map/sites-map.widget';
import { AggregatedEmissionHelper } from '../../../../shared/helpers/aggregated-emission.helper';
import './account-dashboard.scss';


interface IProps  {
    user: IUser, 
    aggregatedEmissions?: Array<IAggregatedEmission>,
    pledges?: Array<any>,
    sites?: Array<ISite>,
    showModal: (entityType: string) => void
}

const AccountDashboard: FunctionComponent<IProps> = (props) => {

    const { aggregatedEmissions, pledges, sites, user, showModal} = props;

    const [ summaryEmissions, setSummaryEmissions] = useState<IAggregatedEmission>();

    let widgetPledges = [];
    if(pledges)
        widgetPledges = pledges.slice(Math.max(pledges.length - 3, 0)).reverse();
    

    useEffect(() => {
        if(aggregatedEmissions)
        {
            const summaryAggr = AggregatedEmissionHelper.GetSummaryAggregatedEmissions(aggregatedEmissions);
            setSummaryEmissions(summaryAggr);
        }
    }, [aggregatedEmissions]);

    return (
        <div className="account-dasboard">
            <SitesMapWidget 
                sites={sites}
                detailsLink="account/sites"
            />
            <EmissionWidget
                isVisible={true}
                title="Climate actions"
                height={284}
                detailsLink="account/climate-actions"
                aggregatedEmission={summaryEmissions}
            />
            <ClimateAccountabilityWidget
                height={490}
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
    );
}

export default AccountDashboard;
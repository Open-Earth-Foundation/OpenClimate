import React, { FunctionComponent } from 'react'
import ISite from '../../../../api/models/DTO/Site/ISite';
import IEmission from '../../../../api/models/review/entity/emission';
import ClimateAccountabilityWidget from '../../../../shared/components/widgets/climate-accountability/climate-accountability.widget';
import EmissionWidget from '../../../../shared/components/widgets/emission/emission.widget';
import PledgesWidget from '../../../../shared/components/widgets/pledges/pledges.widget';
import ReportsWidget from '../../../../shared/components/widgets/reports/reports.widget';
import SitesMapWidget from '../../../../shared/components/widgets/sites-map/sites-map.widget';
import './account-dashboard.scss';


interface IProps  {
    pledges?: Array<any>,
    sites?: Array<ISite>
    showModal: (entityType: string) => void
}

const AccountDashboard: FunctionComponent<IProps> = (props) => {

    const {pledges, sites, showModal} = props;

    const emissionData: IEmission = {
        totalGrossEmissions: 350,
        landUseSinks: 100,
        totalNetEmissions: 250
    }
/*
    const pledges: Array<IPledge> = [
        {pledgeType:"GHG Emissions", goal:30, goalBy: new Date(2030, 1, 1), relativeTo: new Date(2005, 1, 1), title: "Nationally Determined Contribution (NDC)"},
        {pledgeType:"Carbon Intencity", goal:30, goalBy: new Date(2025, 1, 1), relativeTo: new Date(2018, 1, 1), title: "Voluntary"},
        {pledgeType:"Carbon Intencity", goal:30, goalBy: new Date(2035, 1, 1), relativeTo: new Date(2005, 1, 1), title: "Voluntary"}
    ];*/

    let widgetPledges = [];
    if(pledges)
        widgetPledges = pledges.slice(Math.max(pledges.length - 3, 0)).reverse();

    return (
        <div className="account-dasboard">
            <EmissionWidget
                title="Climate actions"
                emissionData={emissionData} 
                height={284}
                detailsLink="account/climate-actions"
            />
            <SitesMapWidget 
                sites={sites}
                detailsLink="account/sites"
            />
            <ClimateAccountabilityWidget
                height={490}
            />
            <PledgesWidget
                pledges={widgetPledges} 
                detailsLink="account/pledges"
                height={490}
                showModal={showModal}
                showAddBtn={true}
                voluntary={true}
            />
            <ReportsWidget
                height={490}
            />
        </div>
    );
}

export default AccountDashboard;
 
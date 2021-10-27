import React, { FunctionComponent } from 'react'
import Transfers from '../../../shared/components/widgets/transfers/transfers.widget';
import ITrackedEntity from '../../../api/models/review/entity/tracked-entity';
import PledgesWidget from '../../../shared/components/widgets/pledges/pledges.widget';
import EmissionWidget from '../../../shared/components/widgets/emission/emission.widget';
import ClimateUnitsWidget from '../../../shared/components/widgets/climate-units/climate-units.widget';
import AgreementWidget from '../../../shared/components/widgets/agreement/agreement.widget';
import './review-dashboard.scss';

interface Props {
    selectedEntity: ITrackedEntity,
    showModal: (type: string) => void
}

const Dashboard: FunctionComponent<Props> = (props) => {
    const { selectedEntity, showModal } = props;

    const pledgesHeight = selectedEntity.pledges && selectedEntity.pledges.length ? 490 : 250;
    const transfersHeight = selectedEntity.transfers ? 490 : 250;

    return (
        <div className="review__dashboard">
            <EmissionWidget 
                isVisible={true}
                title="Emission Inventory" 
                height={220}
                width={490}
                aggregatedEmission={selectedEntity.aggregatedEmission} 
                detailsClick={() => showModal('information-emission')}
            />
            <AgreementWidget
                treaties = {selectedEntity.treaties}
                height={220}
                detailsClick={() => showModal('information-agreements')}
            />
             <ClimateUnitsWidget 
                retiredUnitsData={selectedEntity.retiredUnits}  
                height={220}
                detailsClick={() => showModal('information-climate-units')}
            />

            <PledgesWidget 
                pledges={selectedEntity.pledges} 
                height={pledgesHeight}
                showModal={showModal}
                detailsClick={() => showModal('information-pledges')}
                showAddBtn={false}
                voluntary={false}
            />
            <Transfers 
                transfers={selectedEntity.transfers} 
                height={transfersHeight}
                showModal={showModal}
                detailsClick={() => showModal('information-transfers')}
                showAddBtn={false}
            />
        </div>
    ); 
}


export default Dashboard;

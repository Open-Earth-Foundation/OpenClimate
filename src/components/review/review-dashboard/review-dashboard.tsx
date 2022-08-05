import React, { FunctionComponent } from 'react'
import Transfers from '../../../shared/components/widgets/transfers/transfers.widget';
import ITrackedEntity from '../../../api/models/review/entity/tracked-entity';
import PledgesWidget from '../../../shared/components/widgets/pledges/pledges.widget';
import EmissionWidget from '../../../shared/components/widgets/emission/emission.widget';
import AgreementWidget from '../../../shared/components/widgets/agreement/agreement.widget';
import NestedAccountsWidget from '../../../shared/components/widgets/nested-accounts/nested-accounts.widget';
import { FilterTypes } from '../../../api/models/review/dashboard/filterTypes';
import { useHistory } from 'react-router-dom'
import './review-dashboard.scss';
import Switcher from '../../../shared/components/form-elements/switcher/switcher';
import Masonry from 'react-masonry-css'
import ITreaties from '../../../api/models/DTO/Treaties/ITreaties';
import IPledge from '../../../api/models/DTO/Pledge/IPledge';
import { IEmissionsData } from '../review.page';



interface Props {
    entityType: number,
    treatiesData: ITreaties,
    pledgesData: Array<IPledge>,
    selectedEntity: ITrackedEntity,
    showModal: (type: string) => void
}

const Dashboard: FunctionComponent<Props> = (props) => {
    const { selectedEntity, showModal, treatiesData, pledgesData, entityType } = props;

    const history = useHistory();

    console.log(selectedEntity);
    
    const redirectToNestedAccounts = () => {
        let params = '';

        params = `?country=${selectedEntity.countryCode}&countryId=${selectedEntity.id}`;
        // Include when subnation working with Nested Page
        // if(selectedEntity.type === FilterTypes.National)
        //     params = `?country=${selectedEntity.countryCode}&countryId=${selectedEntity.id}`;
        // else if(selectedEntity.type === FilterTypes.SubNational || selectedEntity.type === FilterTypes.Organization)
        //     params = `?country=${selectedEntity.countryCode}&countryId=${selectedEntity.id}&jurisdictionName=${selectedEntity.jurisdictionName}&jurisdictionCode=${selectedEntity.jurisdictionCode}`;

        history.push(`/nested-accounts${params}`);
    }

    return (
        <div className="review__dashboard">
            <div className="nested-switcher-container">
                <Switcher
                    className='nested-switcher'
                    leftOption='Widget View'
                    rightOption='Nested Map View'
                    leftOptionChosen={true}
                    onChange={redirectToNestedAccounts}
                />
            </div>

            <div className="review__dashboard-widgets">
                <Masonry
                    breakpointCols={3}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column">
                    <EmissionWidget 
                        isVisible={true}
                        title="Total emissions" 
                        height={300}
                        width={490}
                        entityType={entityType}
                        selectedEntity={selectedEntity}
                        aggregatedEmission={selectedEntity.aggregatedEmission} 
                        detailsClick={() => showModal('information-emission')}
                    />

                    <AgreementWidget
                        treaties = {treatiesData}
                        height={220}
                        detailsClick={() => showModal('information-agreements')}
                    />

                    <PledgesWidget 
                        pledges={pledgesData} 
                        showModal={showModal}
                        detailsClick={() => showModal('information-pledges')}
                        showAddBtn={false}
                        voluntary={false}
                    />
                                    <Transfers 
                        // transfers={selectedEntity.transfers} 
                        showModal={showModal}
                        detailsClick={() => showModal('information-transfers')}
                        showAddBtn={false}
                    />

                </Masonry>
            </div>
            
        </div>
    ); 
}


export default Dashboard;
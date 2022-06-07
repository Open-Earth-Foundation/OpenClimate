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


interface IEmissionsData {
    total_ghg: number,
    lastUpdated: string,
    year: number,
    dataProviderName: string,
    methodologyType: string
}

interface Props {
    emissionData: IEmissionsData
    selectedEntity: ITrackedEntity | null,
    showModal: (type: string) => void
}

const Dashboard: FunctionComponent<Props> = (props) => {
    console.log(props.emissionData.total_ghg)
    const { selectedEntity, showModal, emissionData } = props;

    const history = useHistory();
    
    // const redirectToNestedAccounts = () => {
    //     let params = '';

    //     if(selectedEntity.type === FilterTypes.National)
    //         params = `?country=${selectedEntity.countryCode3}`;
    //     else if(selectedEntity.type === FilterTypes.SubNational || selectedEntity.type === FilterTypes.Organization)
    //         params = `?country=${selectedEntity.countryCode3}&jurisdictionName=${selectedEntity.jurisdictionName}&jurisdictionCode=${selectedEntity.jurisdictionCode}`;

    //     history.push(`/nested-accounts${params}`);
    // }

    return (
        <div className="review__dashboard">
            <div className="nested-switcher-container">
                <Switcher
                    className='nested-switcher'
                    leftOption='Widget View'
                    rightOption='Nested Map View'
                    leftOptionChosen={true}
                    // onChange={redirectToNestedAccounts}
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
                        totalGhg = {emissionData.total_ghg}
                        lastupdated = {emissionData.lastUpdated}
                        year = {emissionData.year}
                        source = {emissionData.dataProviderName}
                        methodology = {emissionData.methodologyType}
                        // aggregatedEmission={emissionData.total_ghg} 
                        detailsClick={() => showModal('information-emission')}
                    />

                    <AgreementWidget
                        // treaties = {selectedEntity.treaties}
                        height={220}
                        detailsClick={() => showModal('information-agreements')}
                    />

                    <PledgesWidget 
                        // pledges={selectedEntity.pledges} 
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

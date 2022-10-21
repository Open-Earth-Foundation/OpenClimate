import { FunctionComponent } from 'react'
import ITrackedEntity from '../../../api/models/review/entity/tracked-entity';
import { FilterTypes } from '../../../api/models/review/dashboard/filterTypes';
import { useHistory } from 'react-router-dom'
import './review-dashboard.scss';
import Masonry from 'react-masonry-css'
import ITreaties from '../../../api/models/DTO/Treaties/ITreaties';
import IPledge from '../../../api/models/DTO/Pledge/IPledge';
import PledgesWidget from '../pledges-widget/pledges-widget';
import EmissionsWidget from '../emissions-widget/emissions-widget';
import ContextualDataWidget from '../../../shared/components/widgets/contextual-data/contextual-data.widget';

interface Props {
    entityType: FilterTypes | null,
    treatiesData: ITreaties,
    pledgesData: Array<IPledge>,
    selectedEntity: ITrackedEntity,
    showModal: (type: string) => void
}

const Dashboard: FunctionComponent<Props> = (props) => {
    const { selectedEntity, showModal, treatiesData, pledgesData, entityType } = props;

    const history = useHistory();

    const redirectToNestedAccounts = () => {
        let params = '';

        if(selectedEntity.type === FilterTypes.National)
            params = `?country=${selectedEntity.countryCode}`;
        else if(selectedEntity.type === FilterTypes.SubNational || selectedEntity.type === FilterTypes.Organization)
            params = `?country=${selectedEntity.countryCode}&jurisdictionName=${selectedEntity.jurisdictionName}&jurisdictionCode=${selectedEntity.jurisdictionCode}`;

        history.push(`/nested-accounts${params}`);
    }

    return (
        <div className="review__dashboard">
            <div className="review__dashboard-widgets">
                <Masonry
                    breakpointCols={3}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column">
                    
                    <EmissionsWidget />

                    <PledgesWidget pledgesData={pledgesData} />

                    <ContextualDataWidget/>

                </Masonry>
            </div>

        </div>
    );
}


export default Dashboard;
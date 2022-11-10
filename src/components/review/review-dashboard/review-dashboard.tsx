import { FunctionComponent } from 'react'
import './review-dashboard.scss';
import Masonry from 'react-masonry-css'
import PledgesWidget from '../pledges-widget/pledges-widget';
import EmissionsWidget from '../emissions-widget/emissions-widget';
import ContextualDataWidget from '../../../shared/components/widgets/contextual-data/contextual-data.widget';

interface Props {
    current: any,
    parent: any,
}

const Dashboard: FunctionComponent<Props> = (props) => {
    const { current, parent } = props;

    return (
        <div className="review__dashboard">
            <div className="review__dashboard-widgets">
                <Masonry
                    breakpointCols={3}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column">

                    <EmissionsWidget key={`emissions-${current.actor_id}`} current={current} parent={parent} />

                    <PledgesWidget key={`pledges-${current.actor_id}`} current={current} parent={parent} />

                    <ContextualDataWidget key={`contextual-${current.actor_id}`} current={current} parent={parent}/>

                </Masonry>
            </div>

        </div>
    );
}


export default Dashboard;
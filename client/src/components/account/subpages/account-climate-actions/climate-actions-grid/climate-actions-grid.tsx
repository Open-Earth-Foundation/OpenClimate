import React, { FunctionComponent } from 'react'
import './climate-actions-grid.scss';
import EmissionsCard from './emissions-card/emissions-card';

interface IProps  {
}

const ClimateActionsGrid: FunctionComponent<IProps> = (props) => {


    return (
        <div className="account__climate-actions-grid">
            <EmissionsCard />
            <EmissionsCard />
            <EmissionsCard />
        </div>
    );
}

export default ClimateActionsGrid;
 

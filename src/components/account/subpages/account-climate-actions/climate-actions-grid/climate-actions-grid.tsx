import React, { FunctionComponent, useEffect, useState } from 'react'
import IClimateAction from '../../../../../api/models/DTO/ClimateAction/IClimateActions/IClimateAction';
import { CommonHelper } from '../../../../../shared/helpers/common.helper';
import './climate-actions-grid.scss';
import EmissionsCard from './emissions-card/emissions-card';

interface IProps  {
    climateActions: Array<IClimateAction>
}

const ClimateActionsGrid: FunctionComponent<IProps> = (props) => {

    const { climateActions } = props;

    const [groupedActionsByType, setGroupedActionsByType] = useState<any>({});

    useEffect(() => {

        const grouped = CommonHelper.GroupByKey(climateActions, 'facility_type');
        setGroupedActionsByType(grouped);

    }, [climateActions]);

    return (
        <div className="account__climate-actions-grid">
            {
                Object.keys(groupedActionsByType).map((k: any, index: number) => {
                    return (
                        <EmissionsCard 
                            key={index}
                            cardTitle={k}
                            climateActions={groupedActionsByType[k]}
                        />
                    )
                })
            }
        </div>
    );
}

export default ClimateActionsGrid;
 
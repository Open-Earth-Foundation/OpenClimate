import React, { FunctionComponent } from 'react'
import { FilterTypes } from '../../../api/models/review/dashboard/filterTypes';
import ITrackedEntity from '../../../api/models/review/entity/tracked-entity';
import ContextBar from './context-bar/context-bar';
import './context-bars.scss';

interface Props {
    entitySelected: boolean, 
    collapceEntities: Array<ITrackedEntity>,
    deselectFilter: (filterType: FilterTypes) => void,
}

const ContextBars: FunctionComponent<Props> = (props) => {

    const { entitySelected, collapceEntities, deselectFilter } = props;

    
    const earthInfoData: ITrackedEntity = {
        title: `Earth`
    }

    const items = collapceEntities.map((e, index) => {
        
        let deselectFilterType: FilterTypes;

        if(e.type !== undefined)
        {
            const nextIndex: number = e.type + 1;
            deselectFilterType = FilterTypes[FilterTypes[nextIndex] as keyof typeof FilterTypes];
        }

        return (
            <ContextBar 
                size="small" 
                entity={e} 
                key={index} 
                linkClickHandler={() => deselectFilter(deselectFilterType)}

            />
        );
    });

    const size = entitySelected ? "small" : "large";

    return (
        <div className={`places`}>
            <ContextBar entity={earthInfoData} size={size} linkClickHandler={() => deselectFilter(FilterTypes.National)} />
            {items}
        </div>
    );
}


export default ContextBars;
 
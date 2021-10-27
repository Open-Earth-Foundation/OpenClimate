import React, { FunctionComponent } from 'react'
import ITrackedEntity from '../../../api/models/review/entity/tracked-entity';
import ContextBar from './context-bar/context-bar';
import './context-bars.scss';

interface Props {
    entitySelected: boolean, 
    collapceEntities: Array<ITrackedEntity>
}

const ContextBars: FunctionComponent<Props> = (props) => {

    const { entitySelected, collapceEntities } = props;

    
    const earthInfoData: ITrackedEntity = {
        title: `Earth`
    }

    const items = collapceEntities.map((e, index) => {
        return (
            <ContextBar size="small" entity={e} key={index} />
        );
    });

    const size = entitySelected ? "small" : "large";

    return (
        <div className={`places`}>
            <ContextBar entity={earthInfoData} size={size} />
            {items}
        </div>
    );
}


export default ContextBars;
 
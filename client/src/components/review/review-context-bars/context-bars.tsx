import React, { FunctionComponent } from 'react'
import ITrackedEntity from '../../../api/models/review/entity/tracked-entity';
import ContextBar from './context-bar/context-bar';
import './context-bars.scss';

interface Props {
    entitySelected: boolean, 
    earthInfo: ITrackedEntity | null,
    collapceEntities: Array<ITrackedEntity>
}

const ContextBars: FunctionComponent<Props> = (props) => {

    const { entitySelected, earthInfo , collapceEntities } = props;

    
    const items = collapceEntities.map((e, index) => {
        return (
            <ContextBar size="small" entity={e} key={index} />
        );
    });

    const size = entitySelected ? "small" : "large";

    return (
        <div className={`places`}>
            {earthInfo ? 
                <ContextBar entity={earthInfo} size={size} />
                : ""
            }
            {items}
        </div>
    );
}


export default ContextBars;
 
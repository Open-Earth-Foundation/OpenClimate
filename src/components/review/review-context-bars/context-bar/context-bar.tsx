import React, { FunctionComponent } from 'react'
import ITrackedEntity from '../../../../api/models/review/entity/tracked-entity';
import ContextBarData from '../context-bar-data/context-bar-data';
import ContextBarView from '../context-bar-view/context-bar-view';
import { Fade } from "react-awesome-reveal";
import { FilterTypes } from '../../../../api/models/review/dashboard/filterTypes';
import './context-bar.scss';

interface Props {
    entity: ITrackedEntity,
    size: string,
    linkClickHandler: () => void
}

const ContextBar: FunctionComponent<Props> = (props) => {

    const { size, entity, linkClickHandler } = props;

    const content =  (
        <div className={`context-bar ${size}`} >
            <ContextBarView entity={entity} size={size} />
            <ContextBarData entity={entity} linkClickHandler={linkClickHandler} />
        </div>
    );

    const animate = size === "small";


    return (
        <>
            {
                animate ? 
                <Fade direction="up">
                    {content}
                </Fade>
                :
                <Fade>
                    {content}
                </Fade>
            }
        </>
    );
}


export default ContextBar;
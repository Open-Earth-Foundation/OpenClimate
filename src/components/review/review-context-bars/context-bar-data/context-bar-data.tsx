import React, { FunctionComponent } from 'react'
import TrackedEntity from '../../../../api/models/review/entity/tracked-entity';
import ContextBarItem from '../context-bar-item/context-bar-item';
import { EarthData } from '../../../../api/data/review/data/earth';
import './context-bar-data.scss';

interface Props {
    entity: TrackedEntity,
    linkClickHandler: () => void
}

const ContextBarData: FunctionComponent<Props> = (props) => {

    const { entity, linkClickHandler } = props;

    let linkText = "";
    
    let displayHtml = <></>;

    if(entity.title === "Earth")
    {
        const items = EarthData.map((ed, index) => 
            <ContextBarItem key={index} title={ed.title}>
                {ed.content}
            </ContextBarItem>
        );

        linkText = "Explore Earth Status";

        displayHtml = (
            <>
                {items}
            </>
        );
    }
    else
    {
        let items = entity.pledges?.map((ed, index) =>     
            <ContextBarItem key={index} title={`${ed.pledge_emission_reduction ?? 0}%`} showError={true}>
                {ed.pledge_target_year ? 
                    <>by {ed.pledge_target_year} <br/></>
                    : ""
                }
                {ed.pledge_base_year ?
                    <>relative to {ed.pledge_base_year}</>
                    : ""
                }
            </ContextBarItem>
        );

        linkText = "Explore Country Status";

        displayHtml = (
            <>
                <ContextBarItem>
                    <span className="context-bar__data_type">NDC - Pledge</span>
                </ContextBarItem>
                {items}
            </>
        );
    }


    return (
        <div className={`context-bar__data`}>
            <div className='context-bar__data_grid'>
                {displayHtml}
            </div>
            <div className="context-bar__data_link">
                <a href="#" onClick={linkClickHandler}>{linkText}</a>
            </div>
        </div>
    );
}


export default ContextBarData;

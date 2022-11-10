import React, { FunctionComponent } from 'react'
import { CircleFlag } from 'react-circle-flags';
import ITrackedEntity from '../../../../api/models/review/entity/tracked-entity';
import EarthPicLg from '../../img/earth-pic-lg.png';
import EarthPicSm from '../../img/earth-pic-sm.png';
import './context-bar-view.scss';

interface Props {
    entity: ITrackedEntity,
    size: string
}

const ContextBarView: FunctionComponent<Props> = (props) => {

    const { entity,size  } = props;


    let entityHeight = 25;
    let earthIcon = EarthPicSm;

    if(size === "large")
    {
        entityHeight = 65;
        earthIcon = EarthPicLg;
    }

    const icon = entity.flagCode ? <CircleFlag countryCode={entity.flagCode} height={entityHeight} /> : <img src={earthIcon} />;
    
    return (
        <div className={`context-bar__view`}>
            
            <div className="context-bar__pic-wrapper">
                <div className="context-bar__pic">
                    {icon}
                </div>
                <div className="context-bar__title">
                    {entity.title}
                </div>
            </div>
        </div>
    );
}


export default ContextBarView;

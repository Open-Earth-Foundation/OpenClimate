import React, { FunctionComponent } from 'react'
import { useState } from 'react';
import ArrowUp from '../../../../img/arrow up.png';
import ArrowRight from '../../../../img/arrow right.png';
import EmissionsGridRow from './emissions-grid-row/emissions-grid-row';
import './emissions-grid.scss';
import IClimateAction from '../../../../../../api/models/DTO/ClimateAction/IClimateAction';

interface IProps  {
    climateActions: Array<IClimateAction>
}

const EmissionsGrid: FunctionComponent<IProps> = (props) => {

    const { climateActions } = props;

    const [showEmissions, setShowEmissions] = useState(true);

    const arrowIcon = showEmissions ? ArrowUp : ArrowRight;
    const alt = showEmissions ? "hide" : "show";

    return (
        <div className="emissions-grid">
                <div className="emissions-grid__hide-section">
                    
                    <button onClick={() => setShowEmissions(!showEmissions)}>
                        Hide emissions
                        <img src={arrowIcon} alt={alt} className="emissions-grid__collapse-icon" />
                    </button>
                    <span className="emissions-grid__separate-line"></span>
                </div>
                {showEmissions ? 
                <div className="emissions-grid__grid">
                    {
                        climateActions.map((a:IClimateAction, index: number) => <EmissionsGridRow key={`${a.facility_name}_${index}`} climateAction={a} />)
                    }
                </div>
                : ""
                }

        </div>
    );
}

export default EmissionsGrid;
 

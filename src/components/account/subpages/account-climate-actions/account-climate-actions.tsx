import React, { FunctionComponent, useState } from 'react'
import Switcher from '../../../../shared/components/form-elements/switcher/switcher';
import ClimateActionsGrid from './climate-actions-grid/climate-actions-grid';
import ClimateActionsSummary from './climate-actions-summary/climate-actions-summary';
import IClimateAction from '../../../../api/models/DTO/ClimateAction/IClimateActions/IClimateAction';
import { IUser } from '../../../../api/models/User/IUser';
import './account-climate-actions.scss';

interface IProps  {
    user: IUser,
    climateActions: Array<IClimateAction>,
    showModal: (modalType: string, parameters?: object) => void
}

const ClimateActions: FunctionComponent<IProps> = (props) => {
    
    const { climateActions, user, showModal } = props;

    const [gridView, setGridView] = useState(false);

    return (
        <div className="account__climate-actions">
            <div className="account__climate-actions-switcher">
                <Switcher
                    leftOption="Summary view"
                    rightOption="Grid view"
                    className="climate-actions-switcher"
                    leftOptionChosen={true}
                    onChange={() => setGridView(!gridView)}
                />
            </div>
            {gridView ? 
                <ClimateActionsGrid 
                    climateActions={climateActions}
                />
                :
                <ClimateActionsSummary 
                    user={user}
                    climateActions={climateActions}                
                    showModal={showModal} 
                />
            }
        </div>
    );
}

export default ClimateActions;
 
import React, { FunctionComponent, useState } from 'react'
import Switcher from '../../../../shared/components/form-elements/switcher/switcher';
import ClimateActionsGrid from './climate-actions-grid/climate-actions-grid';
import ClimateActionsSummary from './climate-actions-summary/climate-actions-summary';
import IClimateAction from '../../../../api/models/DTO/ClimateAction/IClimateActions/IClimateAction';
import { IUser } from '../../../../api/models/User/IUser';
import './account-climate-actions.scss';
import ISite from '../../../../api/models/DTO/Site/ISite';
import {
    useNotification
  } from '../../../../UI/NotificationProvider';

interface IProps  {
    user: IUser,
    climateActions: Array<IClimateAction>,
    showModal: (modalType: string, parameters?: object) => void,
    sites?: Array<ISite>,
}

const ClimateActions: FunctionComponent<IProps> = (props) => {
    const setNotification = useNotification()
    const { climateActions, sites, user, showModal } = props;

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
                    sites={sites}
                    climateActions={climateActions}                
                    showModal={showModal} 
                />
            }
        </div>
    );
}

export default ClimateActions;
 
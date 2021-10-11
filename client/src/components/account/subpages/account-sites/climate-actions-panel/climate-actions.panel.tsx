import React, { FunctionComponent } from 'react'
import EmissionsGridRow from '../../account-climate-actions/climate-actions-grid/emissions-grid/emissions-grid-row/emissions-grid-row';
import './climate-actions.panel.scss';

interface IProps  {
    showModal: (modalType: string) => void
}

const ClimateActionsPanel: FunctionComponent<IProps> = (props) => {

    const { showModal } = props;

    return (
        <div className="climate-actions-panel">
            <div className="climate-actions-panel__header">
                <div className="climate-actions-panel__title">Climate Actions</div>
                <div className="climate-actions-panel__add">
                    <button className="climate-actions-panel__add-btn add-new" onClick={() => showModal('add-climate-action')} >Add climate action</button>
                </div>
            </div>

            <EmissionsGridRow amount={20} verified={true} timeline={true}/>
            <EmissionsGridRow amount={20} verified={true} timeline={true}/>
            <EmissionsGridRow amount={20} verified={true} timeline={true}/>
        </div>
    );
}

export default ClimateActionsPanel;
 
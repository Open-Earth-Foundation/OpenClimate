import { FunctionComponent } from 'react'
import IClimateAction from '../../../../../api/models/DTO/ClimateAction/IClimateAction';
import EmissionsGridRow from '../../account-climate-actions/climate-actions-grid/emissions-grid/emissions-grid-row/emissions-grid-row';
import './climate-actions.panel.scss';

interface IProps  {
    climateActions: Array<IClimateAction>,
    showModal: (modalType: string) => void
}

const ClimateActionsPanel: FunctionComponent<IProps> = (props) => {

    const { climateActions, showModal } = props;
    
    return (
        <div className="climate-actions-panel">
            <div className="climate-actions-panel__header">
                <div className="climate-actions-panel__title">Climate Actions</div>
                <div className="climate-actions-panel__add">
                    <button className="climate-actions-panel__add-btn add-new" onClick={() => showModal('add-climate-action')} >Add climate action</button>
                </div>

            </div>
            <div>
            {
                climateActions.map((a: IClimateAction, index: number) => {
                    return (
                        <EmissionsGridRow 
                            key={`${a.facility_name}_${index}`}
                            climateAction={a} 
                            timeline={true}/>

                    )
                })
            }
            </div>

        </div>
    );
}

export default ClimateActionsPanel;
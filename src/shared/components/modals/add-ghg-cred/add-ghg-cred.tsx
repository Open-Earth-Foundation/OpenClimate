import React, { FunctionComponent, useState } from 'react'
import { DemoData } from '../../../../api/data/demo/entities.demo';
import { DemoHelper } from '../../../helpers/demo-account.helper';
import Button from '../../form-elements/button/button';
import './add-ghg-cred.modal.scss';
import { ClimateActionTypes } from './../../../../api/models/DTO/ClimateAction/climate-action-types';
import { ClimateActionScopes } from './../../../../api/models/DTO/ClimateAction/climate-action-scopes';

interface Props {
    onModalHide: () => void,
    onModalShow: (entityType: string, parameters?: object) => void,
    type?: ClimateActionTypes,
    scope: ClimateActionScopes,
}

const AddGHGModal: FunctionComponent<Props> = (props) => {

    const { onModalHide, scope, type, onModalShow } = props;

    

    return (
        <div className="add-ghg-cred__content">
            <div className="add-ghg-cred__content_row">
                <div> 
                Select how would you like to add a new climate action
                </div>
            </div>
            <div className="add-ghg-cred__content_row">
                <div className="add-ghg-cred__btn_row">
                    <Button 
                            click={() => onModalShow('send-ghg-proof')}
                            color="primary"
                            text="Add from business wallet"
                            type="button"
                    />
                    <p>Send proof of your emissions directly from your linked Business Wallet. This data will be of higher quality since it is validated by a trusted issuer.</p>
                </div>
                <div className="add-ghg-cred__btn_row">
                    <Button 
                            click={() => onModalShow('add-climate-action', { Scope: scope, Type: type })}
                            color="primary"
                            text="Self-reported"
                            type="button"
                    />
                    <p>Self report your emissions by completing a form. This data will be of lower quality since it is not validated by a trusted issuer.</p>
                </div>
            </div>
        </div>

    );
}


export default AddGHGModal;

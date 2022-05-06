import React, { FunctionComponent, useState } from 'react'
import Button from '../../form-elements/button/button';
import './accept-ghg-proof.modal.scss';
import { ClimateActionTypes } from './../../../../api/models/DTO/ClimateAction/climate-action-types';
import { ClimateActionScopes } from './../../../../api/models/DTO/ClimateAction/climate-action-scopes';

interface Props {
    onModalHide: () => void,
    onModalShow: (entityType: string, parameters?: object) => void,
    type?: ClimateActionTypes,
    scope: ClimateActionScopes,
    scope1: any
}

const AcceptGHGProofModal: FunctionComponent<Props> = (props) => {

    const { onModalHide, scope, type, onModalShow, scope1 } = props;

    return (
        <div className="accept-ghg-proof__content">
            <div className="accept-ghg-proof__content_column">
                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(props.scope1).map(function(value, idx) {
                            return <tr key={idx}>
                                <td>{value}</td>
                                <td>{props.scope1[value].raw}</td>
                            </tr>
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="accept-ghg-proof__btn_row">
                    <div style={{margin: 25, width: 100}}>
                        <Button 
                                click={() => onModalShow('send-ghg-proof')}
                                disabled
                                color="primary"
                                text="Reject"
                                type="button"
                        />
                    </div>
                    <div style={{margin: 25, width: 100}}>
                        <Button 
                                click={() => onModalShow('add-climate-action', { Scope: scope, Type: type })}
                                color="primary"
                                text="Approve"
                                type="button"
                        />
                    </div>
                </div>
            </div>
        </div>

    );
}


export default AcceptGHGProofModal;

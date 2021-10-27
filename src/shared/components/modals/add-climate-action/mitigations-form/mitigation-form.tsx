import React, { FunctionComponent } from 'react'
import Dropdown from '../../../form-elements/dropdown/dropdown';
import Button from '../../../form-elements/button/button';
import { DropdownOption } from '../../../../interfaces/dropdown/dropdown-option';
import ISite from '../../../../../api/models/DTO/Site/ISite';
import { ClimateActionScopes } from '../../../../../api/models/DTO/ClimateAction/climate-action-scopes';
import { ClimateActionTypes } from '../../../../../api/models/DTO/ClimateAction/climate-action-types';
import InputText from '../../../form-elements/input-text/input.text';
import { ClimateActionVerified } from '../../../../../api/models/DTO/ClimateAction/climate-action-verified';


interface Props {
    scopeOptions: Array<DropdownOption>,
    typeOptions: Array<DropdownOption>,
    sites: Array<ISite>,
    defaultScope?: ClimateActionScopes,
    submitHandler: (e: any) => void,
    typeChangedHandler: (name: string, value: string) => void,
    formChangeHandler: (name: string, value: string) => void,
    onModalHide: () => void
}

const MitigationsForm: FunctionComponent<Props> = (props) => {

    const { scopeOptions, typeOptions, sites, defaultScope, 
        submitHandler, typeChangedHandler, formChangeHandler, onModalHide } = props;

    return (
        <form action="/" className="climate-action-form" onSubmit={submitHandler}>
             <div className="modal__content modal__content-btm-mrg">
                <div className="modal__row modal__row_content">
                    <Dropdown
                            withSearch={false}
                            options={typeOptions}
                            title=""
                            emptyPlaceholder="Type"
                            selectedValue={ClimateActionTypes[ClimateActionTypes.Mitigations]}
                            onSelect={(option: DropdownOption) => typeChangedHandler("climate_action_type", option.value)}
                    /> 
                </div>
                <div className="modal__row modal__row_content">
                    <Dropdown
                            withSearch={false}
                            options={scopeOptions}
                            title=""
                            emptyPlaceholder="Scope"
                            selectedValue={defaultScope!== undefined ? ClimateActionScopes[defaultScope] : null}
                            onSelect={(option: DropdownOption) => formChangeHandler("climate_action_scope", option.value)}
                    /> 
                </div>   
                <div className="modal__row modal__row_content">
                    <Dropdown
                            withSearch={false}
                            options={sites.map(s=> {return {name: s.facility_name, value: s.facility_name} as DropdownOption})}
                            title=""
                            emptyPlaceholder="Site"
                            onSelect={(option: DropdownOption) => formChangeHandler("facility_name", option.value)}
                    /> 
                </div> 
                <div className="modal__row modal__row_content">
                        <InputText
                            type="text"
                            placeholder="mitigations co2e" 
                            onChange={(value: string) => formChangeHandler("facility_mitigations_co2e", value)}

                        />
                </div> 
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="verification body" 
                        onChange={(value: string) => formChangeHandler("verification_body", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <Dropdown
                            withSearch={false}
                            options={
                                [
                                    { name: 'Verified', value: ClimateActionVerified[ClimateActionVerified.Verified] },
                                    { name: 'Unverified', value: ClimateActionVerified[ClimateActionVerified.Unverified] }
                                ]
                            }
                            title=""
                            emptyPlaceholder="Verification"
                            onSelect={(option: DropdownOption) => formChangeHandler("verification_result", option.value)}
                    /> 
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="verification credential id" 
                        onChange={(value: string) => formChangeHandler("verification_credential_id", value)}

                    />
                </div>
                

            </div>
                        

            <div className="modal__row modal__row_btn">
                <Button color="primary"
                        text="Submit Climate Action"
                        type="submit"
                        />
            </div>
            <div className="modal__row modal__row_btn">
                <Button color="white"
                        text="Cancel"
                        type="button"
                        click={onModalHide}

                        />
            </div>
        </form>
    );
}


export default MitigationsForm;

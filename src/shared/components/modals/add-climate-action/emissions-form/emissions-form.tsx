import React, { FunctionComponent, useState } from 'react'
import Dropdown from '../../../form-elements/dropdown/dropdown';
import Button from '../../../form-elements/button/button';
import { DropdownOption } from '../../../../interfaces/dropdown/dropdown-option';
import ISite from '../../../../../api/models/DTO/Site/ISite';
import { ClimateActionScopes } from '../../../../../api/models/DTO/ClimateAction/climate-action-scopes';
import { ClimateActionTypes } from '../../../../../api/models/DTO/ClimateAction/climate-action-types';
import FormDatePicker from '../../../form-elements/datepicker/datepicker';
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

const EmissionsForm: FunctionComponent<Props> = (props) => {

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
                            selectedValue={ClimateActionTypes[ClimateActionTypes.Emissions]}
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
                    <FormDatePicker
                      placeholder="date start"
                      onChange={(dateStr: string) => formChangeHandler("credential_reporting_date_start", dateStr)}
                    />
                </div>  
                <div className="modal__row modal__row_content">
                    <FormDatePicker
                      placeholder="date end"
                      onChange={(dateStr: string) => formChangeHandler("credential_reporting_date_end", dateStr)}
                    />
                </div>  
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="co2e" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_co2e", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="fossil" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_co2_fossil", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="biomass" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_co2_biomass", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="ch4" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_ch4", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="n2o" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_n2o", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="hfc" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_hfc", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="pfc" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_pfc", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="sf6" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_sf6", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="combustion co2e" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_combustion_co2e", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="combustion fossil" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_combustion_co2_fossil", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="co2 biomass" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_combustion_co2_biomass", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="combussion ch4" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_combustion_ch4", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="combussion n2o" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_combustion_n2o", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="fvpwt co2e" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_fvpwt_co2e", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="fvpwt co2 fossil" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_fvpwt_co2_fossil", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="fvpwt co2 biomass" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_fvpwt_co2_biomass", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="fvpwt ch4" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_fvpwt_ch4", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="fvpwt n2o" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_fvpwt_n2o", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="fvpwt hfc" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_fvpwt_hfc", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="fvpwt pfc" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_fvpwt_pfc", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="fvpwt sf6" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_fvpwt_sf6", value)}

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


export default EmissionsForm;

import React, { forwardRef, FunctionComponent, ReactElement, useEffect, useState } from 'react'
import InputText from '../../form-elements/input-text/input.text';
import Button from '../../form-elements/button/button';
import FormDatePicker from '../../form-elements/datepicker/datepicker';
import { climateActionService } from '../../../services/climate-action';
import { toast } from 'react-toastify';
import Dropdown from '../../form-elements/dropdown/dropdown';
import { DropdownOption } from '../../../interfaces/dropdown/dropdown-option';
import { CommonHelper } from '../../../helpers/common.helper';
import IClimateAction from '../../../../api/models/DTO/ClimateAction/IClimateAction';
import { ClimateActionTypes } from '../../../../api/models/DTO/ClimateAction/climate-action-types';
import { ClimateActionScopes } from '../../../../api/models/DTO/ClimateAction/climate-action-scopes';
import ISite from '../../../../api/models/DTO/Site/ISite';
import { ClimateActionHelper } from '../../../helpers/climate-action.helper';
import { ClimateActionVerified } from '../../../../api/models/DTO/ClimateAction/climate-action-verified';

interface Props {
    submitButtonText: string,
    sites: Array<ISite>,
    defaultScope?: ClimateActionScopes,
    defaultType?: ClimateActionTypes,
    addClimateAction: (climateAction: IClimateAction) => void,
    onModalHide: () => void
}

const AddClimateActionModal: FunctionComponent<Props> = (props) => {
    
    const { sites, defaultScope, defaultType, addClimateAction, onModalHide } = props;

    const [climateAction, setClimateAction] = useState<IClimateAction>({
        credential_category: `Climate Action`
    });
    
    const [typeOptions, setTypeOptions] = useState<DropdownOption[]>([]);
    const [scopeOptions, setScopeOptions] = useState<DropdownOption[]>([]);

    useEffect(()=>{
        const typeOpt = CommonHelper.EnumToArray(ClimateActionTypes).map(t => {
            return {
                name: t.toString(),
                value: t.toString()
            }
        })
        setTypeOptions(typeOpt);

        const scopeOpt = CommonHelper.EnumToArray(ClimateActionScopes).map(t => {
            return {
                name: t.toString(),
                value: t.toString()
            }
        })
        setScopeOptions(scopeOpt);

        if(defaultScope !== undefined) 
            formChangeHandler("climate_action_scope" , ClimateActionScopes[defaultScope]);
        if(defaultType !== undefined)
            formChangeHandler("climate_action_type" , ClimateActionTypes[defaultType]);

    },[]);

    const submitHandler = (e: any) => {

        e.preventDefault();

        if(climateAction.climate_action_scope)
            ClimateActionHelper.ChangedAllScopesProp(climateAction, climateAction.climate_action_scope);

        climateAction.credential_issue_date = Date.now();
        //climateAction.credential_issuer = "OpenClimate";

        const foundSite=  sites.find(f => f.facility_name === climateAction.facility_name);
        if (foundSite) {
            climateAction.facility_country = foundSite.facility_country;
            climateAction.facility_jurisdiction = foundSite.facility_location; 
            climateAction.facility_sector_ipcc_activity = foundSite.facility_sector_ipcc_activity;
            climateAction.facility_sector_ipcc_category = foundSite.facility_sector_ipcc_category;
            climateAction.facility_sector_naics = foundSite.facility_sector_naics;
        }


        climateActionService.saveClimateAction(climateAction).then(climateAction => {
            addClimateAction(climateAction);
            onModalHide();
            toast("Climate action successfully created");
        });
        return;
    }

    const formChangeHandler = (name: string, value: string) => {
        setClimateAction(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    return (
        <form action="/" className="climate-action-form" onSubmit={submitHandler}>
             <div className="modal__content modal__content-btm-mrg">
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
                            options={typeOptions}
                            title=""
                            emptyPlaceholder="Type"
                            selectedValue={defaultType!== undefined ? ClimateActionTypes[defaultType] : null}
                            onSelect={(option: DropdownOption) => formChangeHandler("climate_action_type", option.value)}
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
                        onChange={(value: string) => formChangeHandler("facility_emissions_scope_co2e", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="fossil" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_scope_co2_fossil", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="biomass" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_scope_co2_biomass", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="ch4" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_scope_ch4", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="n2o" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_scope_n2o", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="hfc" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_scope_hfc", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="pfc" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_scope_pfc", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="sf6" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_scope_sf6", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="combustion co2e" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_scope_combustion_co2e", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="combustion fossil" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_scope_combustion_co2_fossil", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="co2 biomass" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_scope_combustion_co2_biomass", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="combussion ch4" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_scope_combustion_ch4", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="combussion n2o" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_scope_combustion_n2o", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="fvpwt co2e" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_scope_fvpwt_co2e", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="fvpwt co2 fossil" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_scope_fvpwt_co2_fossil", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="fvpwt co2 biomass" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_scope_fvpwt_co2_biomass", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="fvpwt ch4" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_scope_fvpwt_ch4", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="fvpwt n2o" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_scope_fvpwt_n2o", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="fvpwt hfc" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_scope_fvpwt_hfc", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="fvpwt pfc" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_scope_fvpwt_pfc", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="fvpwt sf6" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_scope_fvpwt_sf6", value)}

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
    )
}


export default AddClimateActionModal;

import { FunctionComponent, useState } from 'react'
import { DropdownOption } from '../../../../../interfaces/dropdown/dropdown-option';
import { ClimateActionScopes } from '../../../../../../api/models/DTO/ClimateAction/climate-action-scopes';
import { ClimateActionTypes } from '../../../../../../api/models/DTO/ClimateAction/climate-action-types';
import { ClimateActionVerified } from '../../../../../../api/models/DTO/ClimateAction/climate-action-verified';
import Dropdown from '../../../../form-elements/dropdown/dropdown';
import Button from '../../../../form-elements/button/button';
import ISite from '../../../../../../api/models/DTO/Site/ISite';
import FormDatePicker from '../../../../form-elements/datepicker/datepicker';
import InputText from '../../../../form-elements/input-text/input.text';
import IClimateAction from '../../../../../../api/models/DTO/ClimateAction/IClimateActions/IClimateAction';
import IEmissionsScope1 from '../../../../../../api/models/DTO/ClimateAction/IClimateActions/IEmissions.scope1';

interface Props {
    scopeOptions: Array<DropdownOption>,
    typeOptions: Array<DropdownOption>,
    sites: Array<ISite>,
    saveClimateAction: (action?: IClimateAction) => void,
    typeChangedHandler: (name: string, value: string) => void,
    scopeChangedHandler: (value: string) => void,
    onModalHide: () => void,
}

const EmissionsScope1Form: FunctionComponent<Props> = (props) => {

    const { scopeOptions, typeOptions, sites,  
        saveClimateAction, scopeChangedHandler,  typeChangedHandler, onModalHide } = props;

    const [climateActionScope1, setClimateActionScope1] = useState<IEmissionsScope1>({
        credential_category: `Climate Action`,
        climate_action_type: ClimateActionTypes[ClimateActionTypes.Emissions],
        climate_action_scope: ClimateActionScopes[ClimateActionScopes.Scope1]
    });

    const formChangeHandler = (name: string, value: string) => {
        setClimateActionScope1(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const submitHandler = (e: any) => {
        e.preventDefault();
        
        if(climateActionScope1)
            saveClimateAction(climateActionScope1)
    }


    return (
        <form action="/" className="climate-action-form" onSubmit={submitHandler}>
             <div className="modal__content modal__content-btm-mrg">
                <div className="modal__row modal__row_content">
                    <Dropdown
                            withSearch={false}
                            options={typeOptions}
                            title=""
                            emptyPlaceholder="Credential Type"
                            selectedValue={ClimateActionTypes[ClimateActionTypes.Emissions]}
                            onSelect={(option: DropdownOption) => typeChangedHandler("climate_action_type", option.value)}
                    /> 
                </div>  
                <div className="modal__row modal__row_content">
                    <Dropdown
                            withSearch={false}
                            options={scopeOptions}
                            title=""
                            emptyPlaceholder="Climate Action Scope"
                            selectedValue={ClimateActionScopes[ClimateActionScopes.Scope1]}
                            onSelect={(option: DropdownOption) => scopeChangedHandler(option.value)}
                    /> 
                </div> 
                <div className="modal__row modal__row_content">
                    <Dropdown
                            withSearch={false}
                            options={sites.map(s=> {return {name: s.facility_name, value: s.facility_name} as DropdownOption})}
                            title=""
                            emptyPlaceholder="Facility Name"
                            onSelect={(option: DropdownOption) => formChangeHandler("facility_name", option.value)}
                    /> 
                </div> 
                <div className="modal__row modal__row_content">
                    <FormDatePicker
                      placeholder="Reporting Start Date"
                      onChange={(dateStr: string) => formChangeHandler("credential_reporting_date_start", dateStr)}
                    />
                </div>  
                <div className="modal__row modal__row_content">
                    <FormDatePicker
                      placeholder="Reporting End Date"
                      onChange={(dateStr: string) => formChangeHandler("credential_reporting_date_end", dateStr)}
                    />
                </div>  
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facilit CO2e emissions" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_co2e", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility CO2 fossil emissions" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_co2_fossil", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility CO2 biomass emissions" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_co2_biomass", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility CH4 emissions" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_ch4", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility N2O emissions" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_n2o", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility HFC emissions" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_hfc", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility PFC emissions" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_pfc", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility SF6 emissions" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_sf6", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility Combustion CO2e emissions" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_combustion_co2e", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility Combustion CO2 fossil emissions" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_combustion_co2_fossil", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility Combustion CO2 biomass emissions" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_combustion_co2_biomass", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility Combustion CH4 emissions" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_combustion_ch4", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility Combustion N2O emissions" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_combustion_n2o", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility F, C, P & WT CO2e emissions" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_fvpwt_co2e", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility F, C, P & WT CO2 fossil emissions" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_fvpwt_co2_fossil", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility F, C, P & WT CO2 biomass emissions" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_fvpwt_co2_biomass", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility F, C, P & WT CH4 emissions" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_fvpwt_ch4", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility F, C, P & WT N2O emissions" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_fvpwt_n2o", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility F, C, P & WT HFC emissions" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_fvpwt_hfc", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility F, C, P & WT PFC emissions" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_fvpwt_pfc", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility F, C, P & WT SF6 emissions" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_fvpwt_sf6", value)}

                    />
                </div>

                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Verification Body" 
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
                            emptyPlaceholder="Verification Result"
                            onSelect={(option: DropdownOption) => formChangeHandler("verification_result", option.value)}
                    /> 
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Verification Credential Id" 
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


export default EmissionsScope1Form;

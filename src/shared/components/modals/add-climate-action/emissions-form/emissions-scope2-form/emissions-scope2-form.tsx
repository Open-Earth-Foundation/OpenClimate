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
import IEmissionsScope2 from '../../../../../../api/models/DTO/ClimateAction/IClimateActions/IEmissions.scope2';
import IClimateAction from '../../../../../../api/models/DTO/ClimateAction/IClimateActions/IClimateAction';

interface Props {
    scopeOptions: Array<DropdownOption>,
    typeOptions: Array<DropdownOption>,
    sites: Array<ISite>,
    saveClimateAction: (action?: IClimateAction) => void,
    typeChangedHandler: (name: string, value: string) => void,
    scopeChangedHandler: (value: string) => void,
    onModalHide: () => void
}

const EmissionsScope2Form: FunctionComponent<Props> = (props) => {

    const { scopeOptions, typeOptions, sites,   
        saveClimateAction, scopeChangedHandler, typeChangedHandler, onModalHide } = props;

    const [climateActionScope2, setClimateActionScope2] = useState<IEmissionsScope2>({
        credential_category: `Climate Action`,
        climate_action_type: ClimateActionTypes[ClimateActionTypes.Emissions],
        climate_action_scope: ClimateActionScopes[ClimateActionScopes.Scope2]
    });

    const formChangeHandler = (name: string, value: string) => {
        setClimateActionScope2(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const submitHandler = (e: any) => {
        e.preventDefault();
        
        if(climateActionScope2)
            saveClimateAction(climateActionScope2)
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
                            selectedValue={ClimateActionScopes[ClimateActionScopes.Scope2]}
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
                        placeholder="Facility CO2e emissions" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_co2e", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility Grid Operator" 
                        onChange={(value: string) => formChangeHandler("facility_energy_grid_operator_name", value)}

                    />
                </div>  
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility Energy Consumption" 
                        onChange={(value: string) => formChangeHandler("facility_energy_consumption", value)}

                    />
                </div>  
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility CO2e emissions (market based)" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_market_based_co2e", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility CO2e emissions (location based)" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_location_based_co2e", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility Grid Operator CO2 rate" 
                        onChange={(value: string) => formChangeHandler("facility_energy_grid_operator_co2_rate", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility Grid Operator CH4 rate" 
                        onChange={(value: string) => formChangeHandler("facility_energy_grid_operator_ch4_rate", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility Grid Operator N2O rate" 
                        onChange={(value: string) => formChangeHandler("facility_energy_grid_operator_n2o_rate", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility CO2 emissions (location based)" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_location_based_co2", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility CH4 emissions (location based)" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_location_based_ch4", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Facility N2O emissions (location based)" 
                        onChange={(value: string) => formChangeHandler("facility_emissions_location_based_n2o", value)}

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


export default EmissionsScope2Form;

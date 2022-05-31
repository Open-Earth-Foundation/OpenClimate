import React, { FunctionComponent, useState } from 'react'
import Dropdown from '../../../form-elements/dropdown/dropdown';
import Button from '../../../form-elements/button/button';
import { DropdownOption } from '../../../../interfaces/dropdown/dropdown-option';
import ISite from '../../../../../api/models/DTO/Site/ISite';
import { ClimateActionScopes } from '../../../../../api/models/DTO/ClimateAction/climate-action-scopes';
import { ClimateActionTypes } from '../../../../../api/models/DTO/ClimateAction/climate-action-types';
import InputText from '../../../form-elements/input-text/input.text';
import { ClimateActionVerified } from '../../../../../api/models/DTO/ClimateAction/climate-action-verified';
import IMitigations from '../../../../../api/models/DTO/ClimateAction/IClimateActions/IMitigations';
import IClimateAction from '../../../../../api/models/DTO/ClimateAction/IClimateActions/IClimateAction';
import { IUser } from '../../../../../api/models/User/IUser';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from "react-datepicker";

interface Props {
    user: IUser | null,
    scopeOptions: Array<DropdownOption>,
    typeOptions: Array<DropdownOption>,
    sites: Array<ISite>,
    defaultScope: ClimateActionScopes,
    typeChangedHandler: (name: string, value: string) => void,
    scopeChangedHandler: (value: string) => void
    onModalHide: () => void,
    saveClimateAction: (aciton: IClimateAction) => void
}

const MitigationsForm: FunctionComponent<Props> = (props) => {

    const { scopeOptions, typeOptions, sites, defaultScope, user,
        typeChangedHandler, scopeChangedHandler,  onModalHide, saveClimateAction } = props;

    const { formState, register,  handleSubmit, setValue, control } = useForm();

    const submitHandler = (data: any) => {
        delete data['form-signed'];
        saveClimateAction(data)
    }

    return (
        <form autoComplete="off" action="/" className="climate-action-form" onSubmit={handleSubmit(submitHandler)}>
             <div className="modal__content modal__content-btm-mrg">
                <div className="modal__row modal__row_content">

                    <Dropdown
                        withSearch={false}
                        options={typeOptions}
                        title=""
                        emptyPlaceholder="* Credential Type"
                        selectedValue={ClimateActionTypes[ClimateActionTypes.Mitigations]}
                        onSelect={(option: DropdownOption) => typeChangedHandler("credential_type", option.value)}
                        register={register}
                        label="credential_type"
                        required={true}
                        errors={formState.errors['credential_type']}
                        setValue={setValue}
                    /> 
                </div>
                <div className="modal__row modal__row_content">
                    <Dropdown
                        withSearch={false}
                        options={scopeOptions}
                        title=""
                        emptyPlaceholder="Climate Action Scope"
                        selectedValue={defaultScope!== undefined ? ClimateActionScopes[defaultScope] : null}
                        onSelect={(option: DropdownOption) => scopeChangedHandler(option.value)}
                        register={register}
                        label="climate_action_scope"
                        required={true}
                        errors={formState.errors['climate_action_scope']}
                        setValue={setValue}
                    /> 
                </div>   
                <div className="modal__row modal__row_content">
                    <Dropdown
                        withSearch={false}
                        options={sites.map(s=> {return {name: s.facility_name, value: s.facility_name} as DropdownOption})}
                        title=""
                        emptyPlaceholder="* Facility Name"
                        register={register}
                        label="facility_name"
                        required={true}
                        errors={formState.errors['facility_name']}
                        setValue={setValue}
                    />
                </div> 
                <div className="modal__row modal__row_content">
                    <Controller
                        control={control}
                        name='credential_reporting_date_start'
                        render={({ field }) => (
                            <DatePicker
                            className={`input-text__element`} 
                                placeholderText='Reporting Start Date'
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                            />
                        )}
                    />
                </div>  
                <div className="modal__row modal__row_content">
                    <Controller
                        control={control}
                        name='credential_reporting_date_end'
                        rules={{required: true}}
                        render={({ field }) => (
                            <DatePicker
                                className={`input-text__element`} 
                                placeholderText='* Reporting End Date'
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                            />
                        )}
                    />

                    {formState.errors['credential_reporting_date_end'] && (
                        <span role="alert">
                        This field is required
                        </span>
                    )}
                </div>  
                <div className="modal__row modal__row_content">
                    <InputText 
                        type="number"
                        placeholder="* Facility CO2e mitigations"
                        register={register}
                        label="facility_mitigations_co2e"
                        required={true}
                        errors={formState.errors['facility_mitigations_co2e']}
                    />
                </div> 
                <div className="modal__row modal__row_content">
                    <InputText 
                        type="text"
                        placeholder="Verification Body" 
                        register={register}
                        label="verification_body"
                        required={false}
                        errors={formState.errors['verification_body']}
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
                            emptyPlaceholder="* Verification Result"
                            register={register}
                            label="verification_result"
                            required={true}
                            errors={formState.errors['verification_result']}
                            setValue={setValue}
                    /> 
                </div>
                <div className="modal__row modal__row_content">
                    <InputText 
                        type="text"
                        placeholder="Verification Credential Id" 
                        register={register}
                        label="verification_credential_id"
                        required={false}
                        errors={formState.errors['verification_credential_id']}
                    />
                </div>

                <div className="transfer-form__sign-as modal__row modal__row_content">
                    <input  
                        type="checkbox" 
                        className={`transfer-form__checkbox checkbox-primary ${formState.errors['form-signed'] ? 'is-empty' : ''}` }
                        {...register('form-signed', { required: true })}
                    />

                    Sign as 
                    <a href="#"> {user?.email} </a>
                    in representation of 
                    <a href="#"> {user?.company?.name}</a>
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

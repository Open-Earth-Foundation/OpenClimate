import { FunctionComponent, useEffect, useState } from "react";
import { DropdownOption } from "../../../../../interfaces/dropdown/dropdown-option";
import { ClimateActionScopes } from "../../../../../../api/models/DTO/ClimateAction/climate-action-scopes";
import { ClimateActionTypes } from "../../../../../../api/models/DTO/ClimateAction/climate-action-types";
import { ClimateActionVerified } from "../../../../../../api/models/DTO/ClimateAction/climate-action-verified";
import Dropdown from "../../../../form-elements/dropdown/dropdown";
import Button from "../../../../form-elements/button/button";
import ISite from "../../../../../../api/models/DTO/Site/ISite";
import InputText from "../../../../form-elements/input-text/input.text";
import IClimateAction from "../../../../../../api/models/DTO/ClimateAction/IClimateActions/IClimateAction";
import IEmissionsScope1 from "../../../../../../api/models/DTO/ClimateAction/IClimateActions/IEmissions.scope1";
import DatePicker from "react-datepicker";
import { IUser } from "../../../../../../api/models/User/IUser";
import { useForm, Controller } from "react-hook-form";

interface Props {
  user: IUser | null;
  scopeOptions: Array<DropdownOption>;
  typeOptions: Array<DropdownOption>;
  sites: Array<ISite>;
  saveClimateAction: (action?: IClimateAction) => void;
  typeChangedHandler: (name: string, value: string) => void;
  scopeChangedHandler: (value: string) => void;
  onModalHide: () => void;
}

const EmissionsScope1Form: FunctionComponent<Props> = (props) => {
  const { formState, register, handleSubmit, setValue, control } = useForm();

  const {
    scopeOptions,
    typeOptions,
    sites,
    user,
    saveClimateAction,
    scopeChangedHandler,
    typeChangedHandler,
    onModalHide,
  } = props;

  const submitHandler = (data: any) => {
    delete data["form-signed"];
    saveClimateAction(data);
  };

  return (
    <form
      autoComplete="off"
      action="/"
      className="climate-action-form"
      onSubmit={handleSubmit(submitHandler)}
    >
      <div className="modal__content modal__content-btm-mrg">
        <div className="modal__row modal__row_content">
          <Dropdown
            withSearch={false}
            options={typeOptions}
            title=""
            emptyPlaceholder="* Credential Type"
            selectedValue={ClimateActionTypes[ClimateActionTypes.Emissions]}
            onSelect={(option: DropdownOption) =>
              typeChangedHandler("credential_type", option.value)
            }
            register={register}
            label="credential_type"
            required={true}
            errors={formState.errors["credential_type"]}
            setValue={setValue}
          />
        </div>
        <div className="modal__row modal__row_content">
          <Dropdown
            withSearch={false}
            options={scopeOptions}
            title=""
            emptyPlaceholder="* Climate Action Scope"
            selectedValue={ClimateActionScopes[ClimateActionScopes.Scope1]}
            onSelect={(option: DropdownOption) =>
              scopeChangedHandler(option.value)
            }
            register={register}
            label="climate_action_scope"
            required={true}
            errors={formState.errors["climate_action_scope"]}
            setValue={setValue}
          />
        </div>
        <div className="modal__row modal__row_content">
          <Dropdown
            withSearch={false}
            options={sites.map((s) => {
              return {
                name: s.facility_name,
                value: s.facility_name,
              } as DropdownOption;
            })}
            title=""
            emptyPlaceholder="* Facility Name"
            register={register}
            label="facility_name"
            required={true}
            errors={formState.errors["facility_name"]}
            setValue={setValue}
          />
        </div>
        <div className="modal__row modal__row_content">
          <Controller
            control={control}
            name="credential_reporting_date_start"
            render={({ field }) => (
              <DatePicker
                className={`input-text__element`}
                placeholderText="Reporting Start Date"
                onChange={(date) => field.onChange(date)}
                selected={field.value}
              />
            )}
          />
        </div>
        <div className="modal__row modal__row_content">
          <Controller
            control={control}
            name="credential_reporting_date_end"
            rules={{ required: true }}
            render={({ field }) => (
              <DatePicker
                className={`input-text__element`}
                placeholderText="* Reporting End Date"
                onChange={(date) => field.onChange(date)}
                selected={field.value}
              />
            )}
          />

          {formState.errors["credential_reporting_date_end"] && (
            <span role="alert">This field is required</span>
          )}
        </div>
        <div className="modal__row modal__row_content">
          <InputText
            type="number"
            placeholder="* Facility CO2e emissions"
            register={register}
            label="facility_emissions_co2e"
            required={true}
            errors={formState.errors["facility_emissions_co2e"]}
          />
        </div>
        <div className="modal__row modal__row_content">
          <InputText
            type="number"
            placeholder="Facility CO2 fossil emissions"
            register={register}
            label="facility_emissions_co2_fossil"
            required={false}
            errors={formState.errors["facility_emissions_co2_fossil"]}
          />
        </div>
        <div className="modal__row modal__row_content">
          <InputText
            type="number"
            placeholder="Facility CO2 biomass emissions"
            register={register}
            label="facility_emissions_co2_biomass"
            required={false}
            errors={formState.errors["facility_emissions_co2_biomass"]}
          />
        </div>
        <div className="modal__row modal__row_content">
          <InputText
            type="number"
            placeholder="Facility CH4 emissions"
            register={register}
            label="facility_emissions_ch4"
            required={false}
            errors={formState.errors["facility_emissions_ch4"]}
          />
        </div>
        <div className="modal__row modal__row_content">
          <InputText
            type="number"
            placeholder="Facility N2O emissions"
            register={register}
            label="facility_emissions_n2o"
            required={false}
            errors={formState.errors["facility_emissions_n2o"]}
          />
        </div>
        <div className="modal__row modal__row_content">
          <InputText
            type="number"
            placeholder="Facility HFC emissions"
            register={register}
            label="facility_emissions_hfc"
            required={false}
            errors={formState.errors["facility_emissions_hfc"]}
          />
        </div>
        <div className="modal__row modal__row_content">
          <InputText
            type="number"
            placeholder="Facility PFC emissions"
            register={register}
            label="facility_emissions_pfc"
            required={false}
            errors={formState.errors["facility_emissions_pfc"]}
          />
        </div>
        <div className="modal__row modal__row_content">
          <InputText
            type="number"
            placeholder="Facility SF6 emissions"
            register={register}
            label="facility_emissions_sf6"
            required={false}
            errors={formState.errors["facility_emissions_sf6"]}
          />
        </div>
        <div className="modal__row modal__row_content">
          <InputText
            type="number"
            placeholder="Facility Combustion CO2e emissions"
            register={register}
            label="facility_emissions_combustion_co2e"
            required={false}
            errors={formState.errors["facility_emissions_combustion_co2e"]}
          />
        </div>
        <div className="modal__row modal__row_content">
          <InputText
            type="number"
            placeholder="Facility Combustion CO2 fossil emissions"
            register={register}
            label="facility_emissions_combustion_co2_fossil"
            required={false}
            errors={
              formState.errors["facility_emissions_combustion_co2_fossil"]
            }
          />
        </div>
        <div className="modal__row modal__row_content">
          <InputText
            type="number"
            placeholder="Facility Combustion CO2 biomass emissions"
            register={register}
            label="facility_emissions_combustion_co2_biomass"
            required={false}
            errors={
              formState.errors["facility_emissions_combustion_co2_biomass"]
            }
          />
        </div>
        <div className="modal__row modal__row_content">
          <InputText
            type="number"
            placeholder="Facility Combustion CH4 emissions"
            register={register}
            label="facility_emissions_combustion_ch4"
            required={false}
            errors={formState.errors["facility_emissions_combustion_ch4"]}
          />
        </div>
        <div className="modal__row modal__row_content">
          <InputText
            type="number"
            placeholder="Facility Combustion N2O emissions"
            register={register}
            label="facility_emissions_combustion_n2o"
            required={false}
            errors={formState.errors["facility_emissions_combustion_n2o"]}
          />
        </div>
        <div className="modal__row modal__row_content">
          <InputText
            type="number"
            placeholder="Facility F, C, P & WT CO2e emissions"
            register={register}
            label="facility_emissions_fvpwt_co2e"
            required={false}
            errors={formState.errors["facility_emissions_fvpwt_co2e"]}
          />
        </div>
        <div className="modal__row modal__row_content">
          <InputText
            type="number"
            placeholder="Facility F, C, P & WT CO2 fossil emissions"
            register={register}
            label="facility_emissions_fvpwt_co2_fossil"
            required={false}
            errors={formState.errors["facility_emissions_fvpwt_co2_fossil"]}
          />
        </div>
        <div className="modal__row modal__row_content">
          <InputText
            type="number"
            placeholder="Facility F, C, P & WT CO2 biomass emissions"
            register={register}
            label="facility_emissions_fvpwt_co2_biomass"
            required={false}
            errors={formState.errors["facility_emissions_fvpwt_co2_biomass"]}
          />
        </div>
        <div className="modal__row modal__row_content">
          <InputText
            type="number"
            placeholder="Facility F, C, P & WT CH4 emissions"
            register={register}
            label="facility_emissions_fvpwt_ch4"
            required={false}
            errors={formState.errors["facility_emissions_fvpwt_ch4"]}
          />
        </div>
        <div className="modal__row modal__row_content">
          <InputText
            type="number"
            placeholder="Facility F, C, P & WT N2O emissions"
            register={register}
            label="facility_emissions_fvpwt_n2o"
            required={false}
            errors={formState.errors["facility_emissions_fvpwt_n2o"]}
          />
        </div>
        <div className="modal__row modal__row_content">
          <InputText
            type="number"
            placeholder="Facility F, C, P & WT HFC emissions"
            register={register}
            label="facility_emissions_fvpwt_hfc"
            required={false}
            errors={formState.errors["facility_emissions_fvpwt_hfc"]}
          />
        </div>
        <div className="modal__row modal__row_content">
          <InputText
            type="number"
            placeholder="Facility F, C, P & WT PFC emissions"
            register={register}
            label="facility_emissions_fvpwt_pfc"
            required={false}
            errors={formState.errors["facility_emissions_fvpwt_pfc"]}
          />
        </div>
        <div className="modal__row modal__row_content">
          <InputText
            type="number"
            placeholder="Facility F, C, P & WT SF6 emissions"
            register={register}
            label="facility_emissions_fvpwt_sf6"
            required={false}
            errors={formState.errors["facility_emissions_fvpwt_sf6"]}
          />
        </div>

        <div className="modal__row modal__row_content">
          <InputText
            type="text"
            placeholder="Verification Body"
            register={register}
            label="verification_body"
            required={false}
            errors={formState.errors["verification_body"]}
          />
        </div>
        <div className="modal__row modal__row_content">
          <Dropdown
            withSearch={false}
            options={[
              {
                name: "Verified",
                value: ClimateActionVerified[ClimateActionVerified.Verified],
              },
              {
                name: "Unverified",
                value: ClimateActionVerified[ClimateActionVerified.Unverified],
              },
            ]}
            title=""
            emptyPlaceholder="* Verification Result"
            register={register}
            label="verification_result"
            required={true}
            errors={formState.errors["verification_result"]}
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
            errors={formState.errors["verification_credential_id"]}
          />
        </div>

        <div className="transfer-form__sign-as modal__row modal__row_content">
          <input
            type="checkbox"
            className={`transfer-form__checkbox checkbox-primary ${
              formState.errors["form-signed"] ? "is-empty" : ""
            }`}
            {...register("form-signed", { required: true })}
          />
          Sign as
          <a href="#"> {user?.email} </a>
          in representation of
          <a href="#"> {user?.company?.name}</a>
        </div>
      </div>

      <div className="modal__row modal__row_btn">
        <Button color="primary" text="Submit Climate Action" type="submit" />
      </div>
      <div className="modal__row modal__row_btn">
        <Button color="white" text="Cancel" type="button" click={onModalHide} />
      </div>
    </form>
  );
};

export default EmissionsScope1Form;

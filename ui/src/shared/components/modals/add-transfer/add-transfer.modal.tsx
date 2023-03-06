import React, { FunctionComponent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DropdownOption } from "../../../interfaces/dropdown/dropdown-option";
import { transferService } from "../../../services/transfer.service";
import Button from "../../form-elements/button/button";
import Dropdown from "../../form-elements/dropdown/dropdown";
import InputText from "../../form-elements/input-text/input.text";
import { IUser } from "../../../../api/models/User/IUser";
import ITransfer from "../../../../api/models/DTO/Transfer/ITransfer";
import ISite from "../../../../api/models/DTO/Site/ISite";
import { CountryCodesHelper } from "../../../helpers/country-codes.helper";
import { FilterTypes } from "../../../../api/models/review/dashboard/filterTypes";
import { useForm, Controller } from "react-hook-form";
import { ReviewHelper } from "../../../helpers/review.helper";
import DatePicker from "react-datepicker";

interface Props {
  user: IUser | null;
  sites: Array<ISite>;
  onModalHide: () => void;
  addTransfer: (transfer: any) => void;
}

const AddTransferModal: FunctionComponent<Props> = (props) => {
  const { user, sites, onModalHide, addTransfer } = props;

  const [countryOptions, setCountryOptions] = useState<Array<DropdownOption>>(
    []
  );
  const [subnationalOptions, setSubnationalOptions] = useState<
    Array<DropdownOption>
  >([]);

  const { formState, register, handleSubmit, setValue, control } = useForm();

  const submitHandler = (data: any) => {
    if (!user || !user.company || !user.company.organization_id) return;

    delete data["form-signed"];

    const countryName = CountryCodesHelper.GetCountryNameByAlpha3(
      data["transfer_receiver_country"]
    );
    data["transfer_receiver_country"] = countryName;

    const jurisdiction = CountryCodesHelper.GetRegionNameByCode(
      data["transfer_receiver_jurisdiction"]
    );
    data["transfer_receiver_jurisdiction"] = jurisdiction;

    const transfer = { ...data };

    transfer.credential_category = "Transfers";
    transfer.credential_type = "Transfer Report";
    transfer.credential_issuer = "OpenClimate";
    transfer.credential_issue_date = Date.now();
    transfer.organization_name = user.company?.name;
    transfer.signature_name = `${user.email}`;
    //todo

    const foundSite = sites.find(
      (f) => f.facility_name === transfer.facility_name
    );
    if (foundSite) {
      transfer.facility_country = foundSite.facility_country;
      transfer.facility_jurisdiction = foundSite.facility_jurisdiction;
      transfer.facility_location = foundSite.facility_location;
      transfer.facility_sector_ipcc_activity =
        foundSite.facility_sector_ipcc_activity;
      transfer.facility_sector_ipcc_category =
        foundSite.facility_sector_ipcc_category;
      transfer.facility_sector_naics = foundSite.facility_sector_naics;
      transfer.facility_type = foundSite.facility_type;
    }

    transferService
      .saveTransfer(user.company.organization_id, transfer)
      .then((transfer) => {
        addTransfer(transfer);
        onModalHide();
        toast("Transfer successfully created");
      });
  };

  useEffect(() => {
    setCountryOptions(CountryCodesHelper.GetCountryOptions());
  }, []);

  const countryChangeHandler = async (option: DropdownOption) => {
    const countryCode2 = CountryCodesHelper.GetCountryAlpha2(option.value);
    const suboptions = await ReviewHelper.GetOptions(
      FilterTypes.SubNational,
      countryCode2
    );
    setSubnationalOptions(suboptions);
  };

  const countryDeselectHandler = () => {
    setSubnationalOptions([]);
  };

  return (
    <form
      autoComplete="off"
      action="/"
      className="transfer-form"
      onSubmit={handleSubmit(submitHandler)}
    >
      <div className="modal__content modal__content-btm-mrg">
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
            emptyPlaceholder="* Facility name"
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
            name="transfer_date"
            rules={{ required: true }}
            render={({ field }) => (
              <DatePicker
                className={`input-text__element`}
                placeholderText="* Date"
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
            type="text"
            placeholder="* Type"
            register={register}
            label="transfer_goods"
            required={true}
            errors={formState.errors["transfer_goods"]}
          />
        </div>
        <div className="modal__row modal__row_content">
          <InputText
            type="text"
            placeholder="* Quantity"
            register={register}
            label="transfer_quantity"
            required={true}
            errors={formState.errors["transfer_quantity"]}
          />
        </div>
        <div className="modal__row modal__row_content">
          <InputText
            type="text"
            placeholder="* Unit"
            register={register}
            label="transfer_quantity_unit"
            required={true}
            errors={formState.errors["transfer_quantity_unit"]}
          />
        </div>
        <div className="modal__row modal__row_content">
          <InputText
            type="number"
            placeholder="* Carbon associated (tn CO2eq)"
            register={register}
            label="transfer_carbon_associated"
            required={true}
            errors={formState.errors["transfer_carbon_associated"]}
          />
        </div>
        <div className="modal__row modal__row_content">
          <InputText
            type="text"
            placeholder="Carbon intensity"
            register={register}
            label="transfer_carbon_intensity"
            required={false}
            errors={formState.errors["transfer_carbon_intensity"]}
          />
        </div>
        <div className="modal__row modal__row_content">
          <InputText
            type="text"
            placeholder="Carbon intensity credential Id"
            register={register}
            label="transfer_carbon_intensity_credential_id"
            required={false}
            errors={formState.errors["transfer_carbon_intensity_credential_id"]}
          />
        </div>
        <div className="modal__row modal__row_content">
          <InputText
            type="text"
            placeholder="* Receiver organization"
            register={register}
            label="transfer_receiver_organization"
            required={true}
            errors={formState.errors["transfer_receiver_organization"]}
          />

          <a
            href="#"
            className="transfer-form__link modal__link modal__link_blue modal__form-link"
          >
            Invite to connect through Open Climate (coming soon)
          </a>
        </div>
        <div className="modal__row modal__row_content">
          <Dropdown
            withSearch={true}
            options={countryOptions}
            title=""
            emptyPlaceholder="* Receiver Country"
            register={register}
            label="transfer_receiver_country"
            onSelect={countryChangeHandler}
            onDeSelect={() => countryDeselectHandler()}
            required={true}
            errors={formState.errors["transfer_receiver_country"]}
            setValue={setValue}
          />
        </div>
        <div className="modal__row modal__row_content">
          <Dropdown
            withSearch={false}
            options={subnationalOptions}
            title=""
            emptyPlaceholder="Receiver Jurisdiction"
            register={register}
            label="transfer_receiver_jurisdiction"
            required={true}
            errors={formState.errors["transfer_receiver_jurisdiction"]}
            setValue={setValue}
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
        <Button color="primary" text="Submit Transfer" type="submit" />
      </div>
      <div className="modal__row modal__row_btn">
        <Button color="white" text="Cancel" type="button" click={onModalHide} />
      </div>
    </form>
  );
};

export default AddTransferModal;

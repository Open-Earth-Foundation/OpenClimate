import React, { FunctionComponent, useEffect, useState } from "react";
import { DropdownOption } from "../../../interfaces/dropdown/dropdown-option";
import Button from "../../form-elements/button/button";
import Dropdown from "../../form-elements/dropdown/dropdown";
import InputText from "../../form-elements/input-text/input.text";
import { pledgeService } from "../../../services/pledge.service";
import { toast } from "react-toastify";
import { IUser } from "../../../../api/models/User/IUser";
import IPledge from "../../../../api/models/DTO/Pledge/IPledge";
import { PledgeSchemas } from "../../../../api/data/shared/pledge-schemas";
import "./add-pledge.modal.scss";

import { useForm } from "react-hook-form";

interface Props {
  user: IUser | null;
  onModalHide: () => void;
  addPledge: (pledge: any) => void;
}

const AddPledgeModal: FunctionComponent<Props> = (props) => {
  const { user, onModalHide, addPledge } = props;

  const [target, setTarget] = useState("");
  const [pledgeSchemas, setPledgeSchemas] = useState<any>([]);
  const [targetOptions, setTargetOptions] = useState<Array<DropdownOption>>([]);
  const [extraFields, setExtraFields] = useState<Array<any>>([]);

  const { formState, register, handleSubmit, setValue, unregister } = useForm();

  useEffect(() => {
    if (!pledgeSchemas.length) {
      setPledgeSchemas(PledgeSchemas);
      console.log("Pledges", PledgeSchemas);
      const options = PledgeSchemas?.map((rf: any) => {
        return {
          name: rf["display_name"],
          value: rf["type"],
        };
      });

      setTargetOptions(options);
    }
  }, []);

  const updateExtraFields = (target: string) => {
    if (extraFields.length) {
      extraFields.forEach((field) => unregister(field.name));
      setExtraFields([]);
    }

    const pledgeSchema = pledgeSchemas.find((ps: any) => ps["type"] === target);
    setExtraFields(pledgeSchema["fields"]);
  };

  const targetChangedHandler = (option: DropdownOption) => {
    updateExtraFields(option.value);
    setTarget(option.value);
  };

  const submitHandler = (data: any) => {
    if (!user || !user.company || !user.company.organization_id) return;

    delete data["form-signed"];
    const dbPledge = { ...data };

    dbPledge.credential_issue_date = Date.now();
    dbPledge.credential_category = "Pledges";
    dbPledge.credential_issuer = "OpenClimate";
    dbPledge.organization_name = user.company.organization_name;
    dbPledge.signature_name = `${user.email}`;

    pledgeService
      .savePledge(user.company.organization_id, dbPledge)
      .then((pledge) => {
        addPledge(pledge);
        onModalHide();
        toast("Pledge successfully created");
      });

    return;
  };

  return (
    <form
      autoComplete="off"
      action="/"
      className="pledge-form"
      onSubmit={handleSubmit(submitHandler)}
      noValidate
    >
      <div className="modal__content modal__content-btm-mrg">
        <div className="modal__row modal__row_content">
          <InputText
            type="number"
            placeholder="* Target year"
            register={register}
            label="pledge_target_year"
            required={true}
            errors={formState.errors["pledge_target_year"]}
          />
        </div>
        <div className="modal__row modal__row_content">
          <Dropdown
            withSearch={false}
            options={targetOptions}
            title=""
            emptyPlaceholder="* Target"
            onSelect={(option: DropdownOption) => targetChangedHandler(option)}
            onDeSelect={() => setTarget("")}
            register={register}
            label="credential_type"
            required={true}
            errors={formState.errors["credential_type"]}
            setValue={setValue}
          />
        </div>

        {extraFields.map((ps: any, index: number) => {
          return (
            <div
              className="modal__row modal__row_content"
              key={`${target}_${ps.name}_${index}`}
            >
              <InputText
                type={ps.type}
                placeholder={ps.placeholder}
                register={register}
                label={ps.name}
                required={ps.required}
                errors={formState.errors[ps.name]}
              />
            </div>
          );
        })}

        {extraFields.length ? (
          <div className="transfer-form__sign-as modal__row modal__row_content">
            <input
              type="checkbox"
              className={`transfer-form__checkbox checkbox-primary ${
                formState.errors["form-signed"] ? "is-empty" : ""
              }`}
              {...register("form-signed", { required: true })}
            />
            Sign as
            <a href="#"> {user?.email}</a>
            in representation of
            <a href="#"> {user?.company?.name}</a>
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="modal__row modal__row_btn">
        <Button color="primary" text="Save" type="submit" />
      </div>
      <div className="modal__row modal__row_btn">
        <Button color="white" text="Cancel" type="button" click={onModalHide} />
      </div>
    </form>
  );
};

export default AddPledgeModal;

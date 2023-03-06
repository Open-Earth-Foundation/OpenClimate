import React, { FunctionComponent } from "react";
import { Path, UseFormRegister } from "react-hook-form";
import "./input.text.scss";

interface Props {
  placeholder: string;
  type?: string;
  required?: boolean;
  onChange?: (value: string, error?: boolean) => void;

  register?: UseFormRegister<any>;
  label?: Path<any>;
  errors?: any;
}

const InputText: FunctionComponent<Props> = (props) => {
  const { placeholder, type, required, onChange, register, label, errors } =
    props;

  const changeHandler = (e: any) => {
    const value = e.target.value;

    if (onChange) onChange(value);
  };

  return (
    <div className="input-text">
      {register && label ? (
        <>
          <input
            autoComplete="off"
            className={`input-text__element`}
            type={type ? type : "text"}
            placeholder={placeholder}
            {...register(label, { required })}
          />
          {errors && errors.type === "required" && (
            <span role="alert">This field is required</span>
          )}
        </>
      ) : (
        <input
          autoComplete="off"
          className={`input-text__element`}
          type={type ? type : "text"}
          onChange={changeHandler}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default InputText;

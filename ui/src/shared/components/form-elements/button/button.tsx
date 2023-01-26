import React, { FunctionComponent } from "react";
import "./button.scss";

interface Props {
  type: any;
  text: string;
  color: string;
  disabled?: boolean;
  click?: () => void;
}

const Button: FunctionComponent<Props> = (props) => {
  const { text, type, color, disabled, click } = props;

  return (
    <div className="button">
      <button
        onClick={click}
        disabled={disabled}
        className={`button__element button__element_${color}`}
        type={type}
      >
        {text}
      </button>
    </div>
  );
};

export default Button;

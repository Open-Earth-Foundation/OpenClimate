import React, { FunctionComponent, useState } from "react";
import { DemoData } from "../../../../api/data/demo/entities.demo";
import { DemoHelper } from "../../../helpers/demo-account.helper";
import Button from "../../form-elements/button/button";
import "./demo-info.modal.scss";

interface Props {
  onModalHide: () => void;
  doDemoLogin: (email: string, password: string, demo: boolean) => void;
}

const DemoInfoModal: FunctionComponent<Props> = (props) => {
  const { onModalHide, doDemoLogin } = props;

  const clickHandler = async () => {
    await DemoHelper.PrepareDemoAccount();
    doDemoLogin(DemoData.DemoUser.email, DemoData.DemoUser.password, true);
  };

  return (
    <div className="demo-info">
      <div className="modal__content demo-info__content modal__content-btm-mrg">
        <div className="modal__row">
          You are using a Demo account with Demo Data
        </div>
      </div>
      <div className="modal__row modal__row_btn">
        <Button
          click={clickHandler}
          color="primary"
          text="Continue"
          type="button"
        />
      </div>
    </div>
  );
};

export default DemoInfoModal;

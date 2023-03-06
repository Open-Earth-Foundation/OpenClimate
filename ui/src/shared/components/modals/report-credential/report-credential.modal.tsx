import React, { FunctionComponent, useState } from "react";
import "./report-credential.modal.scss";

interface Props {}

const ReportCredentialModal: FunctionComponent<Props> = (props) => {
  return (
    <form autoComplete="off" action="/" className="report-credential-form">
      <div className="modal__content report-credential-form__content">
        <div className="modal__row">
          Please, contact{" "}
          <a href="#" className="modal__link modal__link_blue">
            openclimate@openearth.org{" "}
          </a>
          <br />
          With a description of any issues related to your credential
          information
        </div>
      </div>
    </form>
  );
};

export default ReportCredentialModal;

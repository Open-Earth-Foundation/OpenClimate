import React, { FunctionComponent, useEffect, useState } from "react";
import { ClimateActionScopes } from "../../../../../../../../api/models/DTO/ClimateAction/climate-action-scopes";
import { ClimateActionTypes } from "../../../../../../../../api/models/DTO/ClimateAction/climate-action-types";
import { ClimateActionVerified } from "../../../../../../../../api/models/DTO/ClimateAction/climate-action-verified";
import IClimateAction from "../../../../../../../../api/models/DTO/ClimateAction/IClimateActions/IClimateAction";
import IEmissions from "../../../../../../../../api/models/DTO/ClimateAction/IClimateActions/IEmissions";
import IMitigations from "../../../../../../../../api/models/DTO/ClimateAction/IClimateActions/IMitigations";
import { ClimateActionHelper } from "../../../../../../../../shared/helpers/climate-action.helper";
import VerifiedIcon from "../../../../../../img/check.png";
import UnverifiedIcon from "../../../../../../img/unverified.svg";
import Moment from "moment";
import "./scope-tile-item.scss";

interface IProps {
  climateAction: IClimateAction;
  fontSize?: number;
  titleAmount?: string;
}

const ScopeTileItem: FunctionComponent<IProps> = (props) => {
  const { climateAction, fontSize, titleAmount } = props;

  const [amount, setAmount] = useState(0);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (climateAction) {
      const cType =
        ClimateActionTypes[
          climateAction.credential_type as keyof typeof ClimateActionTypes
        ];
      const amount =
        cType === ClimateActionTypes.Emissions
          ? (climateAction as IEmissions).facility_emissions_co2e
          : (climateAction as IMitigations).facility_mitigations_co2e;

      if (amount) setAmount(amount);

      if (
        climateAction.verification_result &&
        climateAction.verification_result ===
          ClimateActionVerified[ClimateActionVerified.Verified]
      )
        setVerified(true);
    }
  }, [climateAction]);

  let color = "red";
  if (climateAction)
    color =
      climateAction.credential_type?.toString() ==
      ClimateActionTypes[ClimateActionTypes.Mitigations]
        ? "green"
        : "red";

  return (
    <div className="scope-tile__signed-item">
      <div className="scope-tile__header">
        <div
          className="scope-tile__amount scope-item-amount"
          style={{ fontSize: fontSize, color: color }}
        >
          {amount ? amount : ""}
        </div>
        {titleAmount ? (
          <div className="scope-tile__amount amount-title">{titleAmount}</div>
        ) : (
          ""
        )}
      </div>

      <div className="scope-tile__content">
        <div className="scope-tile__content-header scope-item-signedby-header">
          Signed by
        </div>
        <div className="scope-tile__signed-by scope-item-signedby">
          {climateAction?.signature_name}
        </div>
        <div className="scope-tile__signed-footer">
          <div className="scope-tile__signed-date scope-item-signed-date">
            {Moment(climateAction.credential_issue_date).format("MMM DD yyyy")}
          </div>
          <div className="scope-tile__verified scope-item-verified">
            {verified ? (
              <>
                <img
                  src={VerifiedIcon}
                  alt="verified"
                  className="scope-verified-icon"
                />
                <span> Verified by {climateAction.verification_body} </span>
              </>
            ) : (
              <>
                <img
                  src={UnverifiedIcon}
                  alt="not verified"
                  className="scope-verified-icon"
                />
                <span> Unverified </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScopeTileItem;

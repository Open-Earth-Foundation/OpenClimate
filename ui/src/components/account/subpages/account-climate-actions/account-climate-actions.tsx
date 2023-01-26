import React, { FunctionComponent, useState } from "react";
import ClimateActionsGrid from "./climate-actions-grid/climate-actions-grid";
import ClimateActionsSummary from "./climate-actions-summary/climate-actions-summary";
import IClimateAction from "../../../../api/models/DTO/ClimateAction/IClimateActions/IClimateAction";
import { IUser } from "../../../../api/models/User/IUser";
import "./account-climate-actions.scss";
import ISite from "../../../../api/models/DTO/Site/ISite";
import IWallet from "../../../../api/models/DTO/Wallet/IWallet";
import { useNotification } from "../../../../UI/NotificationProvider";

interface IProps {
  user: IUser;
  climateActions: Array<IClimateAction>;
  showModal: (modalType: string, parameters?: object) => void;
  sites?: Array<ISite>;
  wallets: Array<IWallet>;
}

const ClimateActions: FunctionComponent<IProps> = (props) => {
  const setNotification = useNotification();
  const { climateActions, sites, user, showModal, wallets } = props;

  const [gridView, setGridView] = useState(false);

  return (
    <div className="account__climate-actions">
      {gridView ? (
        <ClimateActionsGrid climateActions={climateActions} />
      ) : (
        <ClimateActionsSummary
          user={user}
          sites={sites}
          climateActions={climateActions}
          showModal={showModal}
          wallets={wallets}
        />
      )}
    </div>
  );
};

export default ClimateActions;

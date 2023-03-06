import React, { FunctionComponent } from "react";
import TransferItem from "../transfer-item/transfer-item";
import TransferArrow from "../../../../img/widgets/transfer-arrow.png";
import ITransfer from "../../../../../api/models/DTO/Transfer/ITransfer";
import "./transfer.scss";

interface Props {
  transfer: ITransfer;
}

const Transfer: FunctionComponent<Props> = (props) => {
  const { transfer } = props;

  return (
    <div className="review-tile__transfer">
      <div className="review-tile__transfer-column review-tile__transfer-column_data">
        <TransferItem
          title={transfer.facility_name}
          description={transfer.facility_jurisdiction}
        />
      </div>
      <div className="review-tile__transfer-column">
        <img src={TransferArrow} alt="arrow" />
      </div>
      <div className="review-tile__transfer-column review-tile__transfer-column_data">
        <TransferItem
          title={transfer.transfer_receiver_organization}
          description={transfer.transfer_receiver_jurisdiction}
        />
      </div>
      {/*
            <div className="review-tile__transfer-column">
                <TransferItem title={transfer.type} description={transfer.typeDescription} />
            </div>
            */}
    </div>
  );
};

export default Transfer;

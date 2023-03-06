import React, { FunctionComponent } from "react";
import "./transfer-item.scss";

interface Props {
  title?: string;
  description?: string;
}

const TransferItem: FunctionComponent<Props> = (props) => {
  const { title, description } = props;

  return (
    <div className="review-tile__transfer-item">
      <div className="review-tile__transfer-item-title">{title}</div>
      <div className="review-tile__transfer-item-description">
        {description}
      </div>
    </div>
  );
};

export default TransferItem;

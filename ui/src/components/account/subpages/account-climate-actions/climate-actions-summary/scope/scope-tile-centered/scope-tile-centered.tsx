import React, { FunctionComponent } from "react";
import { EmissionIcon } from "../../../../../../../api/models/shared/emission/emission-icon";
import ArrowUpIcon from "../../../../../img/arrow-red.png";
import ArrowDownIcon from "../../../../../img/arrow-green.png";
import EqualIcon from "../../../../../img/equal.png";
import "./scope-tile-centered.scss";

interface IProps {
  title: string;
  amount: number;
  description: string;
  onClick?: () => void;
  iconType: EmissionIcon;
}

const ScopeTileCentered: FunctionComponent<IProps> = (props) => {
  const { title, amount, description, onClick, iconType } = props;

  let icon;
  switch (iconType) {
    case EmissionIcon.Down:
      icon = ArrowDownIcon;
      break;
    case EmissionIcon.Up:
      icon = ArrowUpIcon;
      break;
    case EmissionIcon.Equal:
      icon = EqualIcon;
      break;
  }

  return (
    <div className="scope-tile-centered" onClick={onClick}>
      <div className="scope-tile-centered__title">{title}</div>
      <div className={`scope-tile-centered__amount`}>
        <img src={icon} alt="icon" className="scope-tile-centered__icon" />
        {amount}
      </div>
      <div className="scope-tile-centered__description">{description}</div>
    </div>
  );
};

export default ScopeTileCentered;

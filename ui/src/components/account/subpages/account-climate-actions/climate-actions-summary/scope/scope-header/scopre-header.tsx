import React, { FunctionComponent } from "react";
import { FilterTypes } from "../../../../../../../api/models/review/dashboard/filterTypes";
import { ScopeType } from "../../../../../../../api/models/shared/emission/scope-filters";
import InfoIcon from "../../../../../../../shared/img/widgets/info.png";
import Scope1Icon from "../../../../../img/scope1.png";
import Scope2Icon from "../../../../../img/scope2.png";
import Scope3Icon from "../../../../../img/scope3.png";
import "./scope-header.scss";

interface IProps {
  title: string;
  description: string;
  scopeType: ScopeType;
}

const ScopeHeader: FunctionComponent<IProps> = (props) => {
  const { title, description, scopeType } = props;

  let scopeIcon;
  switch (scopeType) {
    case ScopeType.Scope2:
      scopeIcon = Scope2Icon;
      break;
    case ScopeType.Scope3:
      scopeIcon = Scope3Icon;
      break;
    default:
      scopeIcon = Scope1Icon;
  }

  return (
    <div className="scope-header">
      <div className="scope-header__icon">
        <img src={scopeIcon} alt="info" />
      </div>
      <div className="scope-header__title">
        {title}
        <img src={InfoIcon} alt="info" className="scope-header__info-icon" />
      </div>
      <div className="scope-header__description">{description}</div>
    </div>
  );
};

export default ScopeHeader;

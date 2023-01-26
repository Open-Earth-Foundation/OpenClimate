import React, { FunctionComponent, useEffect } from "react";
import { useState } from "react";
import ArrowUp from "../../../../img/widgets/arrow up.png";
import ArrowRight from "../../../../img/widgets/arrow right.png";
import SiteElement from "../../sites-map/sites/site-element/site-element";
import ISite from "../../../../../api/models/DTO/Site/ISite";
import "./site-collapsible.scss";

interface Props {
  country: string;
  sites?: Array<ISite>;
  addBottomBorder: boolean;
  onClickItem?: (selected: boolean, name: string) => void;
}

const SiteCollapsible: FunctionComponent<Props> = (props) => {
  const { country, sites, addBottomBorder, onClickItem } = props;

  const [expanded, setExpanded] = useState(true);

  const icon = expanded ? ArrowUp : ArrowRight;
  const iconAlt = expanded ? "collapse" : "expand";
  const bottomBorderClassName = addBottomBorder ? "bottom-border" : "";

  return (
    <div className="site-collapsible">
      <div className="site-collapsible__location">
        <div className="site-collapsible__location-title">
          {country}
          <img
            src={icon}
            alt={iconAlt}
            onClick={() => setExpanded(!expanded)}
            className="site-collapsible__btn"
          />
        </div>
        <div
          className={`site-collapsible__location-sites ${bottomBorderClassName}`}
        >
          {sites?.map((site: ISite, index: number) => {
            let location = site.facility_jurisdiction
              ? `${site.facility_country}, ${site.facility_jurisdiction}`
              : `${site.facility_country}`;

            return (
              <SiteElement
                isVisible={expanded}
                key={`${site.id}_${index}`}
                name={site.facility_name ? site.facility_name : ""}
                location={location}
                onClick={onClickItem}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SiteCollapsible;
/*
<SiteElement name="Copper Mine 2" location="British Columbia, Canada" selected={false} />
                        <SiteElement name="Eva Project" location="Queensland, Australia" selected={false} />
                        <SiteElement name="Cameron Project " location="Queensland, Australia" selected={false} />
                        <SiteElement name="Project 5" location="Queensland, Australia" selected={false} />
*/

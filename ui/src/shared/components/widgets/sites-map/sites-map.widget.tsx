import React, { FunctionComponent, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import ISite from "../../../../api/models/DTO/Site/ISite";
import WorldwideMap from "../../other/worldwide-map/worldwide-map";
import SitesFiltersWidget from "../sites-filters/sites-filters.widget";
import EyeIcon from "../../../img/widgets/eye.svg";
import "./sites-map.widget.scss";

interface Props {
  sites?: Array<ISite>;
  detailsLink: string;
}

const SitesMapWidget: FunctionComponent<Props> = (props) => {
  const { sites, detailsLink } = props;

  const [displaySites, setDisplaySites] = useState<Array<ISite>>([]);

  useEffect(() => {
    if (sites) setDisplaySites(sites);
  }, [sites]);

  const filterChangedHandler = (dspSites: Array<ISite>) => {
    setDisplaySites([...dspSites]);
  };

  return (
    <div className="widget__sites-map-content">
      <div className="sites-map__sites">
        <SitesFiltersWidget
          isVisible={true}
          sites={sites}
          displaySitesChangedHandler={filterChangedHandler}
          showCountriesSection={false}
        />
        <div className="sites-map__navigate-link">
          <NavLink to={detailsLink} className="widget__link">
            Explore all sites
            <img
              src={EyeIcon}
              alt="explore"
              className="sites-map__navigate-link_icon"
            />
          </NavLink>
        </div>
      </div>

      <WorldwideMap sites={displaySites} />
    </div>
  );
};

export default SitesMapWidget;

import { FunctionComponent, useEffect, useState } from "react";
import { AggregatedEmissionHelper } from "../../../../shared/helpers/aggregated-emission.helper";
import { Fade } from "react-awesome-reveal";
import WorldwideMap from "../../../../shared/components/other/worldwide-map/worldwide-map";
import EmissionWidget from "../../../../shared/components/widgets/emission/emission.widget";
import OtherCredentialsWidget from "../../../../shared/components/widgets/other-credentials/other-credentials.widget";
import SitesFiltersWidget from "../../../../shared/components/widgets/sites-filters/sites-filters.widget";
import ClimateActionsPanel from "./climate-actions-panel/climate-actions.panel";
import ArrowBackIcon from "../../img/arrow-panel-back.png";
import ISite from "../../../../api/models/DTO/Site/ISite";
import IAggregatedEmission from "../../../../api/models/DTO/AggregatedEmission/IAggregatedEmission";
import IClimateAction from "../../../../api/models/DTO/ClimateAction/IClimateActions/IClimateAction";
import { IUser } from "../../../../api/models/User/IUser";
import "./account-sites.scss";

interface IProps {
  user: IUser;
  sites?: Array<ISite>;
  aggregatedEmissions?: Array<IAggregatedEmission>;
  credentials?: Array<string>;
  showModal: (modalType: string) => void;
  getClimateActionsBySite: (sites: Array<ISite>) => Array<IClimateAction>;
}

const AccountSites: FunctionComponent<IProps> = (props) => {
  const {
    user,
    sites,
    aggregatedEmissions,
    credentials,
    showModal,
    getClimateActionsBySite,
  } = props;

  const [panel, setPanel] = useState<any>(null);
  const [displaySites, setDisplaySites] = useState<Array<ISite>>([]);
  const [climateActions, setClimateActions] = useState<Array<IClimateAction>>(
    []
  );
  const [summaryEmissions, setSummaryEmissions] = useState<IAggregatedEmission>(
    {
      credential_category: "Climate Action",
    }
  );

  useEffect(() => {
    setDisplaySites(sites ? [...sites] : []);
    if (sites) {
      updateAggregateEmissions(sites);
      setClimateActions(getClimateActionsBySite(sites));
    }
  }, [sites, aggregatedEmissions]);

  const mapWidth = panel ? "50%" : "100%";

  const showClimateActionsPanel = () => {
    const cPanel = (
      <ClimateActionsPanel
        climateActions={climateActions}
        showModal={showModal}
      />
    );
    setPanel(cPanel);
  };

  const filterChangedHandler = (dspSites: Array<ISite>) => {
    setDisplaySites([...dspSites]);
    updateAggregateEmissions(dspSites);
    setClimateActions(getClimateActionsBySite(dspSites));
  };

  const updateAggregateEmissions = (dsSites: Array<ISite>) => {
    const filteredAggrEmissions = aggregatedEmissions?.filter((ae) =>
      dsSites?.some((s) => s.facility_name == ae.facility_name)
    );
    if (filteredAggrEmissions) {
      const summaryAggrEmissions =
        AggregatedEmissionHelper.GetSummaryAggregatedEmissions(
          filteredAggrEmissions
        );
      setSummaryEmissions(summaryAggrEmissions);
    }
  };

  return (
    <div className="account-sites">
      <div className="account-sites__map" style={{ width: mapWidth }}>
        <WorldwideMap sites={displaySites} />
      </div>
      {panel ? (
        <div className="map-panel">
          <Fade
            direction="right"
            cascade={true}
            triggerOnce={true}
            damping={1}
            fraction={0.2}
          >
            <div className="map-panel__wrapper ">
              <div className="map-panel__back">
                <div
                  className="map-panel__back_link"
                  onClick={() => {
                    setPanel(null);
                  }}
                >
                  <img
                    src={ArrowBackIcon}
                    alt="back"
                    className="map-panel__back_icon"
                  />
                  Back to all widgets
                </div>
              </div>
              {panel}
            </div>
          </Fade>
        </div>
      ) : (
        ""
      )}
      <div className={`account-sites__widgets ${panel ? "hidden" : ""}`}>
        <Fade>
          <div className="account-sites__climate-widget-wrapper">
            <EmissionWidget
              isVisible={true}
              aggregatedEmission={summaryEmissions}
              title="Climate actions"
              className="sites-climate-action"
              width={330}
              height={185}
              detailsClick={showClimateActionsPanel}
            />
            {credentials ? (
              <OtherCredentialsWidget width={320} height={200} />
            ) : (
              ""
            )}
          </div>
          <div className="account-sites__sites-widget-wrapper">
            <SitesFiltersWidget
              isVisible={true}
              showModal={user.demo ? undefined : showModal}
              sites={sites}
              displaySitesChangedHandler={filterChangedHandler}
              showCountriesSection={true}
            />
          </div>
        </Fade>
      </div>
    </div>
  );
};

export default AccountSites;

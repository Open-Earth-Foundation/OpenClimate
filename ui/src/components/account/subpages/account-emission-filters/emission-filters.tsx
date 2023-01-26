import React, { FunctionComponent, useEffect, useState } from "react";
import { ClimateActionScopes } from "../../../../api/models/DTO/ClimateAction/climate-action-scopes";
import { ClimateActionTypes } from "../../../../api/models/DTO/ClimateAction/climate-action-types";
import IClimateAction from "../../../../api/models/DTO/ClimateAction/IClimateActions/IClimateAction";
import SiteFilter from "../../../../shared/components/widgets/sites-filters/site-filter/site-filter";
import ScopeTileItem from "../account-climate-actions/climate-actions-summary/scope/scope-tile/scope-tile-item/scope-tile-item";
import "./emission-filters.scss";

interface IProps {
  climateActions: Array<IClimateAction>;
  type: ClimateActionTypes;
  scope?: ClimateActionScopes;
}

const EmissionFilters: FunctionComponent<IProps> = (props) => {
  const { climateActions, type, scope } = props;

  const [showDetails, setShowDetails] = useState(true);

  const [scopeFilters, setScopeFilters] = useState<any>([]);
  const [displayItems, setDisplayItems] = useState<IClimateAction[]>([]);

  const detailsBtnText = showDetails ? "Hide details" : "Show details";

  useEffect(() => {
    const showFilters = scope === undefined;

    let displayItems = [];
    if (scope !== undefined)
      displayItems = climateActions.filter(
        (a) =>
          a.climate_action_scope?.toString() === ClimateActionScopes[scope] &&
          a.credential_type?.toString() === ClimateActionTypes[type]
      );
    else
      displayItems = climateActions.filter(
        (a) => a.credential_type?.toString() === ClimateActionTypes[type]
      );

    setDisplayItems(displayItems);

    if (showFilters) {
      const sc1 = displayItems.filter(
        (a) =>
          a.climate_action_scope?.toString() ===
          ClimateActionScopes[ClimateActionScopes.Scope1]
      );
      const sc2 = displayItems.filter(
        (a) =>
          a.climate_action_scope?.toString() ===
          ClimateActionScopes[ClimateActionScopes.Scope2]
      );
      const sc3 = displayItems.filter(
        (a) =>
          a.climate_action_scope?.toString() ===
          ClimateActionScopes[ClimateActionScopes.Scope3]
      );

      const scFilters = [
        { name: `All`, actions: displayItems, selected: true },
        { name: `Scope1`, actions: sc1, selected: false },
        { name: `Scope2`, actions: sc2, selected: false },
        { name: `Scope3`, actions: sc3, selected: false },
      ];

      setScopeFilters(scFilters);
    }
  }, [climateActions]);

  const onFilterSelect = (name: string) => {
    const updatedFilters = [...scopeFilters];

    updatedFilters.map((filter) => (filter.selected = false));
    const selectedFilter = updatedFilters.find(
      (filter) => filter.name === name
    );
    selectedFilter.selected = true;

    setScopeFilters(updatedFilters);
    setDisplayItems(selectedFilter.actions);
  };

  const hideHeader = true;

  return (
    <div className="emission-filters">
      <div className="emission-filters__title">Climate actions</div>
      {hideHeader ? (
        ""
      ) : (
        <div className="emission-filters__header">
          <div className="emission-filters__header-wrapper">
            {showDetails ? (
              <table className="emission-filters__header-table">
                <tbody>
                  <tr>
                    <td className="emission-filters__header-table_name">
                      Credential type:
                    </td>
                    <td className="emission-filters__header-table_value">
                      Name of type
                    </td>
                  </tr>
                  <tr>
                    <td className="emission-filters__header-table_name">
                      Issuer:
                    </td>
                    <td className="emission-filters__header-table_value">
                      British Columbia
                    </td>
                  </tr>
                  <tr>
                    <td className="emission-filters__header-table_name">
                      Organizations:
                    </td>
                    <td className="emission-filters__header-table_value">
                      Organization name
                    </td>
                  </tr>
                  <tr>
                    <td className="emission-filters__header-table_name">
                      Attributes
                    </td>
                    <td className="emission-filters__header-table_value">
                      Attribute name
                    </td>
                  </tr>
                  <tr>
                    <td className="emission-filters__header-table_name">
                      Credential Date:
                    </td>
                    <td className="emission-filters__header-table_value">-</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              ""
            )}

            <a
              className="emission-filters__details"
              onClick={() => setShowDetails(!showDetails)}
            >
              {detailsBtnText}
            </a>
          </div>
        </div>
      )}
      <div className="emission-filters__content">
        <div className="emission-filters__content-wrapper">
          <div className="emission-filters__filters">
            {scopeFilters.map((scf: any, index: number) => {
              return (
                <SiteFilter
                  key={`site-filter-${index}`}
                  name={scf.name}
                  onClick={() => onFilterSelect(scf.name)}
                  selected={scf.selected}
                />
              );
            })}
          </div>
          <div className="emission-filters__emissions-list">
            {displayItems.map((di: IClimateAction, index: number) => {
              const scope =
                ClimateActionScopes[
                  di.climate_action_scope as keyof typeof ClimateActionScopes
                ];

              return (
                <ScopeTileItem
                  key={`${di.facility_name}_${index}`}
                  climateAction={di}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmissionFilters;

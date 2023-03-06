import React, { FunctionComponent, useEffect, useState } from "react";
import { useStore } from "react-redux";
import { ClimateActionScopes } from "../../../../../../../api/models/DTO/ClimateAction/climate-action-scopes";
import { ClimateActionHelper } from "../../../../../../../shared/helpers/climate-action.helper";
import ScopeTileItem from "./scope-tile-item/scope-tile-item";
import IClimateActionTile from "../../../../../../../api/models/DTO/ClimateAction/IClimateActionTile";
import { ClimateActionTypes } from "../../../../../../../api/models/DTO/ClimateAction/climate-action-types";
import "./scope-tile.scss";
import IClimateAction from "../../../../../../../api/models/DTO/ClimateAction/IClimateActions/IClimateAction";
import ISite from "../../../../../../../api/models/DTO/Site/ISite";

interface IProps {
  climateActionTile?: IClimateActionTile;
  type?: ClimateActionTypes;
  scope: ClimateActionScopes;
  addOffset?: boolean;
  centered?: boolean;
  showModal: (entityType: string, parameters?: object) => void;
  sites?: Array<ISite>;
}

const ScopeTile: FunctionComponent<IProps> = (props) => {
  const { climateActionTile, scope, sites, type, addOffset, showModal } = props;

  const showEmptyTile =
    !climateActionTile?.climateActions.length &&
    climateActionTile?.type !== ClimateActionTypes.Summary;
  const hideTile =
    !climateActionTile?.total &&
    climateActionTile?.type === ClimateActionTypes.Summary;

  const centeredClass =
    showEmptyTile || climateActionTile?.type == ClimateActionTypes.Summary
      ? "scope-tile_centered"
      : "";

  const visibleTiles = climateActionTile?.climateActions.slice(-2);

  let hiddenTilesCount = 0;
  if (
    climateActionTile?.climateActions &&
    climateActionTile?.climateActions.length > 2
  )
    hiddenTilesCount = climateActionTile?.climateActions.length - 2;

  let addTitle =
    climateActionTile?.type === ClimateActionTypes.Emissions
      ? "emissions"
      : "mitigations";

  return (
    <div className={`scope-tile ${centeredClass}`}>
      {hideTile ? (
        ""
      ) : showEmptyTile ? (
        <div className="scope-tile__add-offset_centered">
          {addOffset ? (
            <button
              className="scope-tile__add-offset-btn scope-item-btn"
              onClick={() =>
                showModal("add-ghg-cred", {
                  Scope: scope,
                  Type: type,
                  sites: sites,
                })
              }
            >
              Add {addTitle}
            </button>
          ) : (
            ""
          )}
        </div>
      ) : (
        <React.Fragment>
          <div className="scope-tile__title">
            <div className="scope-tile__amount">{climateActionTile?.total}</div>
            <div className="scope-tile__header scope-item-header">
              MtCO2e/year
            </div>
            <div className="scope-tile__add-offset_right">
              {addOffset ? (
                <button
                  className="scope-tile__add-offset-btn scope-item-btn"
                  onClick={() =>
                    showModal("add-ghg-cred", { Scope: scope, Type: type })
                  }
                >
                  Add
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="scope-tile__content">
            {visibleTiles?.reverse().map((c: IClimateAction, index: number) => {
              return (
                <ScopeTileItem
                  key={`${c?.facility_name}_${index}`}
                  climateAction={c}
                />
              );
            })}

            {hiddenTilesCount ? (
              <>
                <a
                  href="#"
                  onClick={() =>
                    showModal("emission-filters", { Type: type, Scope: scope })
                  }
                  className="scope-tile__see-more-link"
                >
                  + See {hiddenTilesCount} more
                </a>
              </>
            ) : (
              ""
            )}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default ScopeTile;

import { Dispatch } from "redux";
import IAggregatedEmission from "../../api/models/DTO/AggregatedEmission/IAggregatedEmission";
import IClimateAction from "../../api/models/DTO/ClimateAction/IClimateActions/IClimateAction";
import IGeoSubnational from "../../api/models/DTO/NestedAccounts/IGeoSubnational";
import ISite from "../../api/models/DTO/Site/ISite";
import { aggregatedEmissionService } from "../../shared/services/aggregated-emission.service";
import { climateActionService } from "../../shared/services/climate-action";
import { GeoService } from "../../shared/services/geo.service";
import { siteService } from "../../shared/services/site.service";
import * as nestedAccountsTypes from "./nested-accounts.action-types";

export const nestedAccountsClearState = () => {
  return {
    type: nestedAccountsTypes.NESTED_ACCOUNTS_CLEAR_STATE,
    payload: {},
  };
};

export const startLoading = () => {
  return {
    type: nestedAccountsTypes.START_LOADING,
    payload: {},
  };
};

export const stopLoading = () => {
  return {
    type: nestedAccountsTypes.STOP_LOADING,
    payload: {},
  };
};

export const loadSites = (sites: Array<ISite>) => {
  return {
    type: nestedAccountsTypes.LOAD_SITES,
    payload: {
      sites,
    },
  };
};

export const loadClimateActions = (climateActions: Array<IClimateAction>) => {
  return {
    type: nestedAccountsTypes.LOAD_CLIMATE_ACTIONS,
    payload: {
      climateActions,
    },
  };
};

export const loadAggregatedEmission = (
  aggregatedEmissions: Array<IAggregatedEmission>
) => {
  return {
    type: nestedAccountsTypes.LOAD_AGGREGATED_EMISSIONS,
    payload: {
      aggregatedEmissions,
    },
  };
};

export const loadGeoSubnational = (geoSubnational: IGeoSubnational) => {
  return {
    type: nestedAccountsTypes.LOAD_GEO_SUBNATIONAL,
    payload: {
      geoSubnational,
    },
  };
};

export const doLoadSites = () => {
  return (dispatch: Dispatch) => {
    siteService.allSites().then((sites) => {
      dispatch(loadSites(sites));
    });
  };
};

export const doLoadAggregatedEmissions = () => {
  return (dispatch: Dispatch) => {
    aggregatedEmissionService
      .allAggregatedEmissions()
      .then((aggregatedEmission) => {
        dispatch(loadAggregatedEmission(aggregatedEmission));
      });
  };
};

export const doLoadGeoSubnational = (countryName: string) => {
  return (dispatch: Dispatch) => {
    dispatch(startLoading());

    GeoService.getSubnationalsByCountry(countryName).then(
      (fetchedGeoSubnational: IGeoSubnational) => {
        dispatch(loadGeoSubnational(fetchedGeoSubnational));
        dispatch(stopLoading());

        return fetchedGeoSubnational;
      }
    );
  };
};

export const doLoadClimateActions = (siteName: string) => {
  return (dispatch: Dispatch) => {
    dispatch(startLoading());

    climateActionService
      .getClimateActionsBySite(siteName)
      .then((climateActions: Array<IClimateAction>) => {
        dispatch(loadClimateActions(climateActions));
        dispatch(stopLoading());
      });
  };
};

import { NestedAccountsState } from "./nested-accounts.state";
import * as nestedAccountsTypes from "./nested-accounts.action-types";

const initialState: NestedAccountsState = {
  loading: false,
  sites: [],
  aggregatedEmissions: [],
  sitesLoaded: false,
  aggregatedEmissionsLoaded: false,
  geoSubnationals: [],
  loadedClimateActions: [],
};

export const nestedAccountsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case nestedAccountsTypes.START_LOADING:
      return {
        ...state,
        loading: true,
      };
    case nestedAccountsTypes.STOP_LOADING:
      return {
        ...state,
        loading: false,
      };
    case nestedAccountsTypes.LOAD_SITES:
      return {
        ...state,
        sites: action.payload.sites,
        sitesLoaded: true,
      };
    case nestedAccountsTypes.LOAD_AGGREGATED_EMISSIONS:
      return {
        ...state,
        aggregatedEmissions: action.payload.aggregatedEmissions,
        aggregatedEmissionsLoaded: true,
      };
    case nestedAccountsTypes.LOAD_GEO_SUBNATIONAL:
      return {
        ...state,
        geoSubnationals: [
          ...state.geoSubnationals,
          action.payload.geoSubnational,
        ],
      };
    case nestedAccountsTypes.LOAD_CLIMATE_ACTIONS:
      return {
        ...state,
        loadedClimateActions: state.loadedClimateActions.concat(
          action.payload.climateActions
        ),
      };
    case nestedAccountsTypes.NESTED_ACCOUNTS_CLEAR_STATE:
      return initialState;

    default:
      return state;
  }
};

import { AccountState } from "./account.state"
import * as accountActionTypes from './account.action-types';

const initialState: AccountState = {
    loading: false,
    pledges: [],
    sites: [],
    transfers: [],
    climateActions: [],
    aggregatedEmissions: [],
    pledgesLoaded: false,
    transfersLoaded: false,
    sitesLoaded: false,
    climateActionsLoaded: false,
    aggregatedEmissionsLoaded: false
}


export const accountReducer = ( state = initialState, action: any ) => {
    switch ( action.type ) {
        case accountActionTypes.LOAD_PLEDGES: 
            return {
                ...state,
                pledges: action.payload.pledges,
                pledgesLoaded: true
            };
        case accountActionTypes.ADD_PLEDGE:
            return {
                ...state,
                pledges: [...state.pledges, action.payload.pledge]
            };
        case accountActionTypes.LOAD_TRANSFERS: 
            return {
                ...state,
                transfers: action.payload.transfers,
                transfersLoaded: true
            };
        case accountActionTypes.ADD_TRANSFER:
            return {
                ...state,
                transfers: [...state.transfers, action.payload.transfer]
            };
        case accountActionTypes.LOAD_SITES:
            return {
                ...state,
                sites: action.payload.sites,
                sitesLoaded: true
            };
        case accountActionTypes.ADD_SITE:
            return {
                ...state,
                sites: [...state.sites, action.payload.site]
            };
        case accountActionTypes.LOAD_CLIMATE_ACTIONS:
            return {
                ...state,
                climateActions: action.payload.climateActions,
                climateActionsLoaded: true
            };
        case accountActionTypes.ADD_CLIMATE_ACTIONS:
            return {
                ...state,
                climateActions: [...state.climateActions, action.payload.climateAction]
            };
        case accountActionTypes.LOAD_AGGREGATED_EMISSIONS:
            return {
                ...state,
                aggregatedEmissions: action.payload.aggregatedEmissions,
                aggregatedEmissionsLoaded: true
            };
        case accountActionTypes.ADD_AGGREGATED_EMISSIONS:
            //facility_credential_id
            const newAggrEmission = action.payload.aggregatedEmission
            const updatedAggrEmission = state.aggregatedEmissions.filter(ae => ae.facility_name !== newAggrEmission.facility_name);

            return {
                ...state,
                aggregatedEmissions: [...updatedAggrEmission, newAggrEmission]
            };
        default: return state;
    }
}

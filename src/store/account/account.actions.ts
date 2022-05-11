import { Dispatch } from 'redux'
import IAggregatedEmission from '../../api/models/DTO/AggregatedEmission/IAggregatedEmission';
import IClimateAction from '../../api/models/DTO/ClimateAction/IClimateActions/IClimateAction';
import ISite from '../../api/models/DTO/Site/ISite';
import ITransfer from '../../api/models/DTO/Transfer/ITransfer';
import { aggregatedEmissionService } from '../../shared/services/aggregated-emission.service';
import { climateActionService } from '../../shared/services/climate-action';
import { pledgeService } from '../../shared/services/pledge.service'
import { siteService } from '../../shared/services/site.service';
import { transferService } from '../../shared/services/transfer.service';
import * as accountActionTypes from './account.action-types';

export const accountClearState = () => {
    return {
        type: accountActionTypes.ACCOUNT_CLEAR_STATE,
        payload: {
        }
    }
}


export const loadPledges = (pledges: Array<any>) => {
    return {
        type: accountActionTypes.LOAD_PLEDGES,
        payload: {
            pledges
        }
    }
}

export const addPledge = (pledge: any) => {
    return {
        type: accountActionTypes.ADD_PLEDGE,
        payload: {
            pledge
        }
    }
}

export const loadTransfers = (transfers: Array<ITransfer>) => {
    return {
        type: accountActionTypes.LOAD_TRANSFERS,
        payload: {
            transfers
        }
    }
}

export const addTransfer = (transfer: ITransfer) => {
    return {
        type: accountActionTypes.ADD_TRANSFER,
        payload: {
            transfer
        }
    }
}

export const loadSites = (sites: Array<ISite>) => {
    return {
        type: accountActionTypes.LOAD_SITES,
        payload: {
            sites
        }
    }
}

export const addSite = (site: ISite) => {
    return {
        type: accountActionTypes.ADD_SITE,
        payload: {
            site
        }
    }
}

export const loadClimateActions = (climateActions: Array<IClimateAction>) => {
    return {
        type: accountActionTypes.LOAD_CLIMATE_ACTIONS,
        payload: {
            climateActions
        }
    }
}

export const addClimateAction = (climateAction: IClimateAction) => {
    return {
        type: accountActionTypes.ADD_CLIMATE_ACTIONS,
        payload: {
            climateAction
        }
    }
}

export const loadAggregatedEmission = (aggregatedEmissions: Array<IAggregatedEmission>) => {
    return {
        type: accountActionTypes.LOAD_AGGREGATED_EMISSIONS,
        payload: {
            aggregatedEmissions
        }
    }
}

export const addAggregatedEmission = (aggregatedEmission: IAggregatedEmission) => {
    return {
        type: accountActionTypes.ADD_AGGREGATED_EMISSIONS,
        payload: {
            aggregatedEmission
        }
    }
}

export const doLoadPledges = (orgId: string) => {
    return (dispatch: Dispatch) => {

        pledgeService.allPledges(orgId).then(pledges => {
            dispatch(loadPledges(pledges));
        });

    }
}
 
export const doLoadTransfers = (orgId: string) => {
    return (dispatch: Dispatch) => {

        transferService.allTransfers(orgId).then(transfers => {
            dispatch(loadTransfers(transfers));
        });

    }
}

export const doLoadSites = (orgId: string) => {
    return (dispatch: Dispatch) => {

        siteService.allSitesByOrg(orgId).then(sites => {
            dispatch(loadSites(sites));
        });

    }
}
 
export const doLoadClimateActions = (orgId: string) => {
    return (dispatch: Dispatch) => {

        climateActionService.allClimateAction(orgId).then(climateActions => {
            console.log("Climate actions", climateActions)
            dispatch(loadClimateActions(climateActions));
        });

    }
}
 
export const doLoadAggregatedEmissions = (orgId: string) => {
    return (dispatch: Dispatch) => {

        aggregatedEmissionService.allAggregatedEmissionsByOrg(orgId).then(aggregatedEmission => {
            dispatch(loadAggregatedEmission(aggregatedEmission));
        });

    }
}



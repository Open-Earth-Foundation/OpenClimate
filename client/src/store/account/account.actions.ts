import { Dispatch } from 'redux'
import IClimateAction from '../../api/models/DTO/ClimateAction/IClimateAction';
import ISite from '../../api/models/DTO/Site/ISite';
import ITransfer from '../../api/models/DTO/Transfer/ITransfer';
import { climateActionService } from '../../shared/services/climate-action';
import { pledgeService } from '../../shared/services/pledge.service'
import { siteService } from '../../shared/services/site.service';
import { transferService } from '../../shared/services/transfer.service';
import * as accountActionTypes from './account.action-types';


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


export const doLoadPledges = () => {
    return (dispatch: Dispatch) => {
        //dispatch(startLoading());

        pledgeService.allPledges().then(pledges => {
            dispatch(loadPledges(pledges));
            //dispatch(stopLoading());
        });

    }
}
 
export const doLoadTransfers = () => {
    return (dispatch: Dispatch) => {
        //dispatch(startLoading());

        transferService.allTransfers().then(transfers => {
            dispatch(loadTransfers(transfers));
            //dispatch(stopLoading());
        });

    }
}

export const doLoadSites = () => {
    return (dispatch: Dispatch) => {
        //dispatch(startLoading());

        siteService.allSites().then(sites => {
            dispatch(loadSites(sites));
            //dispatch(stopLoading());
        });

    }
}
 
export const doLoadClimateActions = () => {
    return (dispatch: Dispatch) => {
        //dispatch(startLoading());

        climateActionService.allClimateAction().then(climateActions => {
            dispatch(loadClimateActions(climateActions));
            //dispatch(stopLoading());
        });

    }
}
 




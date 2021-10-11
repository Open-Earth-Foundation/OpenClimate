import { createSelector } from 'reselect';
import { RootState } from '../root-state';

const account = (state: RootState) => state.account;

export const getPledges = createSelector(
    account, 
    items => items.pledges
);

export const getTransfers = createSelector(
    account, 
    items => items.transfers
);

export const getSites = createSelector(
    account, 
    items => items.sites
);

export const getPledgesLoaded = createSelector(
    account, 
    items => items.pledgesLoaded
);

export const getTransfersLoaded = createSelector(
    account, 
    items => items.transfersLoaded
);

export const getSitesLoaded = createSelector(
    account, 
    items => items.sitesLoaded
);

export const getClimateActionsLoaded = createSelector(
    account, 
    items => items.climateActionsLoaded
);

export const getClimateActions = createSelector(
    account, 
    items => items.climateActions
);

import { createSelector } from 'reselect';
import { RootState } from '../root-state';

const nestedAccounts = (state: RootState) => state.nestedAccounts;

export const getSites = createSelector(
    nestedAccounts, 
    items => items.sites
);

export const getSitesLoaded = createSelector(
    nestedAccounts, 
    items => items.sitesLoaded
);

export const getAggregatedEmissionsLoaded = createSelector(
    nestedAccounts, 
    items => items.aggregatedEmissionsLoaded
);

export const getAggregatedEmissions = createSelector(
    nestedAccounts, 
    items => items.aggregatedEmissions
);

export const getLoading = createSelector(
    nestedAccounts, 
    items => items.loading
);

export const getGeoSubnationals = createSelector(
    nestedAccounts, 
    items => items.geoSubnationals
);

export const loadedClimateActions = createSelector(
    nestedAccounts, 
    items => items.loadedClimateActions
);
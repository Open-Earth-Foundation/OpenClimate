import { createSelector } from 'reselect';
import { ReviewState } from './review.state';

const reviewData = (state: ReviewState ) => state;

export const getSelectedEntities = createSelector(
    reviewData, 
    items => items?.selectedEntities 
);

export const getLoading = createSelector(
    reviewData, 
    items => items?.loading
); 

export const getDashboardType = createSelector(
    reviewData, 
    items => items?.dashboardType
);

export const getReviewFilters = createSelector(
    reviewData, 
    items => items?.filters
);
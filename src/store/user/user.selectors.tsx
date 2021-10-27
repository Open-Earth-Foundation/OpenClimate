import { createSelector } from 'reselect';
import { RootState } from '../root-state';

const users = (state: RootState) => state.users;

export const getLoading = createSelector(
    users,
    items => items.loading
);

export const getCurrentUser = createSelector(
    users,
    items => items.currentUser
);

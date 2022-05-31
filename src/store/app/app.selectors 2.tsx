import { createSelector } from 'reselect';
import { RootState } from '../root-state';
import { AppState } from './app.state';

const appData = (state: RootState ) => state.app;

export const getModalConfig = createSelector(
    appData, 
    appData => appData.modalConfig
);
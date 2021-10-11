import { AppState } from './app.state';
import * as appActionTypes from './app.action-types';
import ModalConfig from '../../api/models/shared/modal/modal-config';

const initialState: AppState = {
    modalConfig: { 
        entityType: "",
        parameters: {}
    }
}

const showModal = ( state: AppState, payload: any ) => {

    const parameters = payload.parameters ? payload.parameters : {};

    const updatedModalConfig: ModalConfig = {
        entityType: payload.entityType,
        parameters: parameters
    }

    return {
        ...state,
        modalConfig: updatedModalConfig
    }
}

const hideModal = ( state: AppState, payload: any ) => {

    const updatedModalConfig: ModalConfig = {
        entityType: ""
    }

    return {
        ...state,
        modalConfig: updatedModalConfig
    }
}



export const appReducer = ( state = initialState, action: any ) => {
    switch ( action.type ) {
        case appActionTypes.SHOW_MODAL: return showModal(state, action.payload);
        case appActionTypes.HIDE_MODAL: return hideModal(state, null);

        default: return state;
    }
}

/*

        return {
            ...state,
            modalConfig: {
                entityType: ""
            }
        };

       return {
                ...state,
                loading: true
            };
        case reviewActionTypes.DO_SELECT_FILTER: return selectedFilter(state, action.payload);
        case reviewActionTypes.DO_DESELECT_FILTER: return deselectFilter(state, action.payload);
*/
import * as reviewActionTypes from "./review.action-types"
import { ReviewState } from './review.state'
import ITrackedEntity from "../../api/models/review/entity/tracked-entity"
import { FilterTypes } from "../../api/models/review/dashboard/filterTypes"
import { DropdownOption } from "../../shared/interfaces/dropdown/dropdown-option"
import { CountryCodesHelper } from '../../shared/helpers/country-codes.helper';

const initialState: ReviewState = {

    loading: false,
    earthInfo: null,
    dashboardType: null,
    selectedEntities: [],
    filters: [
        {
            title: "Nation state",
            type: FilterTypes.National,
            selectedValue: "",
            options: CountryCodesHelper.GetContryOptions()
        },
        {
            title: "Subnational",
            type: FilterTypes.SubNational,
            selectedValue: "",
            options: []
        },
        {
            title: "Organization",
            type: FilterTypes.Organization,
            selectedValue: "",
            options: []
        }
    ]
}

const selectFilter = ( state: ReviewState, payload: any ) => {
    const filterType: FilterTypes = payload.filterType;
    const trackedEntity: ITrackedEntity = payload.trackedEntity;
    const filterValue = payload.value;

    let selectedEntities = [ ...state.selectedEntities ];
    let entityIndex = selectedEntities.findIndex(se => se.type === filterType);
    if(entityIndex == -1)
        selectedEntities.push(trackedEntity);
    else    
        selectedEntities[entityIndex] = trackedEntity;

    const updatedFilters = [...state.filters];
    const selectedFilterIndex = updatedFilters.findIndex(f => f.type === filterType);
    updatedFilters[selectedFilterIndex].selectedValue = filterValue;

/*    const newFilterSelected = { ...state.filterSelected };

    Object.keys(newFilterSelected).map(p => {
        if(p === 'national' && filterType === FilterTypes.National)
            newFilterSelected['national'] = trackedEntity;
        else if (p === 'subnational' && filterType === FilterTypes.SubNational)
            newFilterSelected['subnational'] = trackedEntity;
        else if (p === 'organization' && filterType === FilterTypes.SubNational)
            newFilterSelected['organization'] = trackedEntity;
    });
*/
    return {
        ...state,
        selectedEntities: [...selectedEntities],
        dashboardType: filterType,
        filters: [...updatedFilters]
    }

}

const deselectFilter = ( state: ReviewState, payload: any ) => {
    const filterType: FilterTypes = payload.filterType;

    let dashboardType: FilterTypes | null = null;

    const filterIndex = state.filters.findIndex(f => f.type === filterType);

    const updatedFilters = [...state.filters];
    updatedFilters[filterIndex].selectedValue = "";

    updatedFilters.map((f, i) => {
        if(i > filterIndex) {
            f.selectedValue = "";
            f.options = [];
        }
    });

    const entityIndex = state.selectedEntities.findIndex(s => s.type === filterType);
    const updatedEntities = state.selectedEntities.slice(0, entityIndex);

    switch(filterType)
    {
        case FilterTypes.National:
            dashboardType = null;
            break;
        case FilterTypes.SubNational:
            dashboardType = FilterTypes.National;
            break;
        case FilterTypes.Organization:
            dashboardType = FilterTypes.SubNational;
            break;
    }

    return {
        ...state,
        filters: [...updatedFilters],
        selectedEntities: [...updatedEntities],
        dashboardType: dashboardType
    }
}

const updateFilterOptions = ( state: ReviewState, payload: any ) => {
    const filterType: FilterTypes = payload.filterType;
    const options: Array<DropdownOption> = payload.options;

    let newFilters = [ ...state.filters ];
    //newFilters.splice(newFilters.findIndex(f => f.type === filterType), 1);
/*= { 
        options: options,
        selectedValue: "",
        type: filterType
    }; */
    let filterIndex = newFilters.findIndex(f => f.type === filterType);
    newFilters[filterIndex].options = options;
    /*newFilters[filterIndex] = {
        options: options,
        selectedValue: "",
        type: filterType
    };*/

    return {
        ...state,
        filters: [ ...newFilters ]
    }
}


export const reviewReducer = ( state = initialState, action: any ) => {
    switch ( action.type ) {
        case reviewActionTypes.START_LOADING: 
            return {
                ...state,
                loading: true
            };
        case reviewActionTypes.STOP_LOADING: 
            return {
                ...state,
                loading: false
            };
        case reviewActionTypes.DO_SELECT_FILTER: return selectFilter(state, action.payload);
        case reviewActionTypes.DO_DESELECT_FILTER: return deselectFilter(state, action.payload);
        case reviewActionTypes.UPDATE_FILTER_OPTIONS: return updateFilterOptions(state, action.payload);

        default: return state;
    }
}

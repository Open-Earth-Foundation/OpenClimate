import * as reviewActionTypes from "./review.action-types"
import { ReviewState } from './review.state'
import ITrackedEntity from "../../api/models/review/entity/tracked-entity"
import { FilterTypes } from "../../api/models/review/dashboard/filterTypes"
import { DropdownOption } from "../../shared/interfaces/dropdown/dropdown-option"
import { CountryCodesHelper } from '../../shared/helpers/country-codes.helper';
import { IReviewFilter } from "../../api/models/review/dashboard/reviewFilter"

const initialState: ReviewState = {

    loading: false,
    dashboardType: null,
    selectedEntities: [],
    filters: [
        {
            title: "Country",
            type: FilterTypes.National,
            selectedValue: "",
            options: CountryCodesHelper.GetCountryOptions()
        },
        {
            title: "Region",
            type: FilterTypes.SubNational,
            selectedValue: "",
            options: []
        },
        {
            title: "Entity type",
            type: FilterTypes.EntityType,
            selectedValue: 'City',
            options: [{name: 'City', value: 'City'}, {name: 'Organization', value: 'Organization'}],
            isRadio: true
        },
        {
            title: "City",
            type: FilterTypes.City,
            selectedValue: "",
            options: []
        },
        {
            title: "Organization",
            type: FilterTypes.Organization,
            selectedValue: "",
            options: []
        },
        
    ]
}

const selectFilter = ( state: ReviewState, payload: any ) => {
    const filterType: FilterTypes = payload.filterType;
    const trackedEntity: ITrackedEntity = payload.trackedEntity;
    const filterValue = payload.value;

    const selectedEntities = getNextCleanEntities(state.selectedEntities, filterType);

    let entityIndex = selectedEntities.findIndex(se => se.type === filterType);
    if(entityIndex == -1)
        selectedEntities.push(trackedEntity);
    else    
        selectedEntities[entityIndex] = trackedEntity;

    const updatedFilters = getNextCleanFilters(state.filters, filterType);

    const selectedFilterIndex = updatedFilters.findIndex(f => f.type === filterType);
    updatedFilters[selectedFilterIndex].selectedValue = filterValue;

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

    const updatedFilters = getNextCleanFilters(state.filters, filterType);
    const updatedEntities = getNextCleanEntities(state.selectedEntities, filterType);

    switch(filterType)
    {
        case FilterTypes.National:
            dashboardType = null;
            break;
        case FilterTypes.SubNational:
            dashboardType = FilterTypes.National;
            break;
        case FilterTypes.EntityType:
            dashboardType = FilterTypes.EntityType;
            break;
        case FilterTypes.City:
            dashboardType = FilterTypes.City
            break
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

    let filterIndex = newFilters.findIndex(f => {
       
        return f.type === filterType
    });
    
    
    newFilters[filterIndex].options = options;

    return {
        ...state,
        filters: [ ...newFilters ]
    }
}

const getNextCleanFilters = (filters: Array<IReviewFilter>, filterType: FilterTypes) => {
    const filterIndex = filters.findIndex(f => f.type === filterType);

    const updatedFilters = [...filters];
    updatedFilters[filterIndex].selectedValue = "";

    updatedFilters.map((f, i) => {
        if(i > filterIndex) {
            f.selectedValue = "";
            f.options = [];
        }
    });

    return updatedFilters;
}

const getNextCleanEntities = (entities: Array<ITrackedEntity>, filterType: FilterTypes) => {
    const entityIndex = entities.findIndex(s => s.type === filterType);
    return entityIndex !== -1 ? entities.slice(0, entityIndex) : entities;
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
        case reviewActionTypes.REVIEW_CLEAR_STATE: return initialState;

        default: return state;
    }
}

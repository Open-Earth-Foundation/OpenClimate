import { Dispatch } from 'redux'
import { FilterTypes } from '../../api/models/review/dashboard/filterTypes'
import { DropdownOption } from '../../shared/interfaces/dropdown/dropdown-option'
import { CountryCodesHelper } from '../../shared/helpers/country-codes.helper'
import { ReviewHelper } from '../../shared/helpers/review.helper'
import ITrackedEntity from '../../api/models/review/entity/tracked-entity'
import * as reviewActionTypes from './review.action-types'

export const reviewClearState = () => {
    return {
        type: reviewActionTypes.REVIEW_CLEAR_STATE,
        payload: {
        }
    }
}

export const startLoading = () => {
    return {
        type: reviewActionTypes.START_LOADING,
        payload: {}
    }
}

export const stopLoading = () => {
    return {
        type: reviewActionTypes.STOP_LOADING,
        payload: {}
    }
}

export const selectFilter = (filterType: FilterTypes, value: number, trackedEntity: ITrackedEntity) => {
    return {
        type: reviewActionTypes.DO_SELECT_FILTER,
        payload: {
            filterType,
            trackedEntity,
            value
        }
    }
}

export const deselectFilter = (filterType: FilterTypes) => {
    return {
        type: reviewActionTypes.DO_DESELECT_FILTER,
        payload: {
            filterType
        }
    }
}

export const updateFilterOptions = (filterType: FilterTypes, options: Array<DropdownOption>) => {
    return {
        type: reviewActionTypes.UPDATE_FILTER_OPTIONS,
        payload: {
            filterType,
            options
        }
    }
}

export const doSelectFilter = (filterType: FilterTypes, option: DropdownOption, selectedEntities: Array<ITrackedEntity>) => {
    return (dispatch: Dispatch) => {
        dispatch(startLoading());

        setTimeout(async () => {

            const trackedEntity = await ReviewHelper.GetTrackedEntity(filterType, option, selectedEntities);
            dispatch(selectFilter(filterType, option.value, trackedEntity));
            dispatch(stopLoading());

            const nextIndex = filterType + 1;
            if(FilterTypes[nextIndex])
            {
                let loadOptionsType = FilterTypes[FilterTypes[nextIndex] as keyof typeof FilterTypes];

                const countryId =  option.value;
 
                const loadedOptions = await ReviewHelper.GetOptions(loadOptionsType, countryId, trackedEntity); 
                dispatch(updateFilterOptions(loadOptionsType, loadedOptions));
            }
        }, 500);

    }
}


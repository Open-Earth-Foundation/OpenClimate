import React, { FunctionComponent } from 'react'
import Dropdown from '../../../shared/components/form-elements/dropdown/dropdown';
import { DropdownOption } from '../../../shared/interfaces/dropdown/dropdown-option';
import { FilterTypes } from '../../../api/models/review/dashboard/filterTypes';
import { IReviewFilter } from '../../../api/models/review/dashboard/reviewFilter';
import './review-filters.scss';

interface Props {
    nationState: boolean,
    filters: Array<IReviewFilter>,
    selectFilter: (filterType: FilterTypes, option: DropdownOption) => void,
    deselectFilter: (filterType: FilterTypes) => void
}


const ReviewFilters: FunctionComponent<Props> = (props) => {

    const { filters, selectFilter, deselectFilter } = props;

    const selectFilterHandler = (filterType: FilterTypes, option: DropdownOption) => {
        selectFilter(filterType, option);
    };

    const filtersHtml = filters.map((f:IReviewFilter, i:number) => {

        const disabled = f.options.length === 0;
        const selectedValue = f.selectedValue === '' ? null : f.selectedValue;

        return (
            <div className="review__filter" key={i}>                
                <Dropdown 
                withSearch={true}
                searchPlaceholder="Search" 
                options={f.options}
                title={f.title}
                onDeSelect={() => deselectFilter(f.type)}
                onSelect={(option: DropdownOption) => selectFilterHandler(f.type, option)}
                disabled={disabled}
                selectedValue={selectedValue}
                />
            </div>
        );
    });



    return (
        <>
            {filtersHtml}
        </>
    );
}


export default ReviewFilters;
 
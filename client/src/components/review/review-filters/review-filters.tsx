import React, { FunctionComponent } from 'react'
import Dropdown from '../../../shared/components/form-elements/dropdown/dropdown';
import { DropdownOption } from '../../../shared/interfaces/dropdown/dropdown-option';
import './review-filters.scss';
import ICountry from '../../../api/models/review/country';
import { FilterTypes } from '../../../api/models/review/dashboard/filterTypes';
import { IReviewFilter } from '../../../api/models/review/dashboard/reviewFilter';
import { useForm } from 'react-hook-form';

interface Props {
    nationState: boolean,

    filters: Array<IReviewFilter>,
    selectFilter: (filterType: FilterTypes, option: DropdownOption) => void,
    deselectFilter: (filterType: FilterTypes) => void
}


const ReviewFilters: FunctionComponent<Props> = (props) => {

    const { control, register, handleSubmit, formState: { errors } } = useForm();


    const { filters, selectFilter, deselectFilter } = props;

    const selectFilterHandler = (filterType: FilterTypes, option: DropdownOption) => {
        //filter.selectedId = option.value;
        selectFilter(filterType, option);
    };
/*
    const countryCodeOptions = countryCodes.map(cc => {
        return {
            name: cc.name,
            value: cc.codeAlpha2
        }
    });

    const countryFilter = 
        <div className="review__filter">                
            <Dropdown 
            withSearch={true}
            searchPlaceholder="Search" 
            options={countryCodeOptions}
            title="Nation State"
            onDeSelect={() => deselectFilter(FilterTypes.National)}
            onSelect={(option: DropdownOption) => selectFilterHandler(FilterTypes.National, option)}
        /></div>*/

    /*const items = filters.map(ft => {
        return (
            <div className="review__filter" key={ft.id}>
                <Dropdown 
                    searchPlaceholder="Search" 
                    options={ft.values} 
                    title={ft.title}
                    onDeSelect={() => deselectFilter(ft)}
                    onSelect={(option: DropdownOption) => selectFilterHandler(ft, option)
                    }
                />
            </div>
        )
    });*/

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
                {...register(`test${i}`)}
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
 
/*
<div className="review__filter">                
                <Dropdown 
                withSearch={true}
                searchPlaceholder="Search" 
                title="Subnational"
                options={null}
                onDeSelect={() => {}}
                disabled={true}
            /></div>
            <div className="review__filter">                
                <Dropdown 
                withSearch={true}
                searchPlaceholder="Search" 
                title="Organization"
                options={null}
                onDeSelect={() => {}}
                disabled={true}
            /></div>
*/
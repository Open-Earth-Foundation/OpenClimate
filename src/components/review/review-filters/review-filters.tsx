import React, {useState, FunctionComponent, useEffect } from 'react'
import Dropdown from '../../../shared/components/form-elements/dropdown/dropdown';
import { DropdownOption } from '../../../shared/interfaces/dropdown/dropdown-option';
import { FilterTypes } from '../../../api/models/review/dashboard/filterTypes';
import { IReviewFilter } from '../../../api/models/review/dashboard/reviewFilter';
import './review-filters.scss';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    root: {
      paddingTop: 20,
      paddingBottom: 10,
      paddingLeft: 18,
      width: 20,
      height: 19,
    },
    label: {
        paddingLeft: 5,
        paddingTop: 8,
        paddingBottom: 8
    }
}));

const filters = [
    {
        title: "Country",
        type: FilterTypes.National,
        selectedValue: null,
        options: [],
        hidden: false
    },
    {
        title: "Region",
        type: FilterTypes.SubNational,
        selectedValue: null,
        options: [],
        hidden: false
    },
    {
        title: "Entity type",
        type: FilterTypes.EntityType,
        selectedValue: 'City',
        options: [{name: 'City', value: 'City'}, {name: 'Organization', value: 'Organization'}],
        isRadio: true,
        hidden: false
    },
    {
        title: "City",
        type: FilterTypes.City,
        selectedValue: null,
        options: [],
        hidden: false
    },
    {
        title: "Organization",
        type: FilterTypes.Organization,
        selectedValue: null,
        options: [],
        hidden: true
    },
]

interface Props {
    selectFilter: (filterType: FilterTypes, option: DropdownOption) => void,
    deselectFilter: (filterType: FilterTypes) => void
}

const ReviewFilters: FunctionComponent<Props> = (props) => {
    const classes = useStyles();
    const { selectFilter, deselectFilter } = props;
    const [fltr, setFltr] = useState<any>(filters)

    const selectFilterHandler = (filterType: FilterTypes, option: any) => {
        selectFilter(filterType, option);
        const actor_id = option.value
        if (filterType == FilterTypes.National) {
            fetch(`https://dev.openclimate.network/api/v1/actor/${actor_id}/parts?type=adm1`)
            .then((res) => res.json())
            .then((json) => {
                let parts = json.data
                let options = parts.map((part:any) => {return {name: part.name, value: part.actor_id}})
                let u = fltr.slice()
                u[0] = {...u[0], selectedValue: actor_id}
                u[1] = {...u[1], selectedValue: null, options: options}
                u[3] = {...u[3], selectedValue: null, options: []}
                u[4] = {...u[4], selectedValue: null, options: []}
                setFltr(u)
            })
        } else if (filterType == FilterTypes.SubNational) {
            const type = (fltr[3].hidden) ? 'organization' : 'city'
            fetch(`https://dev.openclimate.network/api/v1/actor/${actor_id}/parts?type=${type}`)
            .then((res) => res.json())
            .then((json) => {
                let parts = json.data
                let options = parts.map((part:any) => {return {name: part.name, value: part.actor_id}})
                let u = fltr.slice()
                u[1] = {...u[1], selectedValue: actor_id}
                u[3] = {...u[3], selectedValue: null, options: u[3].hidden ? [] : options}
                u[4] = {...u[4], selectedValue: null, options: u[4].hidden ? [] : options}
                setFltr(u)
            })
        }
    };

    useEffect(() => {
        fetch(`https://dev.openclimate.network/api/v1/actor/EARTH/parts?type=country`)
        .then((res) => res.json())
        .then((json) => {
            let parts = json.data
            let options = parts.map((part:any) => {return {name: part.name, value: part.actor_id}})
            let u = fltr.slice()
            u[0] = {...u[0], options: options}
            u[1] = {...u[1], selectedValue: null, options: []}
            u[3] = {...u[3], selectedValue: null, options: []}
            u[4] = {...u[4], selectedValue: null, options: []}
            setFltr(u)
        })
    }, [])

    const filtersHtml = fltr?.map((f:any, i:number) => {

        const disabled = f.options?.length === 0;
        const selectedValue = f.selectedValue === '' ? null : f.selectedValue;

        const handleEntityChange = (e:React.ChangeEvent<HTMLInputElement>) => {
            const type = e.target.value
            if(type === 'City'){
                let u = fltr.slice()
                u[3] = {...u[3], hidden: false}
                u[4] = {...u[4], hidden: true}
                setFltr(u)
            } else if(type === 'Organization'){
                let u = fltr.slice()
                u[3] = {...u[3], hidden: true}
                u[4] = {...u[4], hidden: false}
                setFltr(u)
            }
        }

        return f?.isRadio ?
        (
            <div className="review__filter review__radio-filters" key={i}>
                <FormControl>
                    <FormLabel className="review__filter-form-label">{ "Entity Type"}</FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      defaultValue="City"
                      onChange={handleEntityChange}
                      sx={{
                          fontSize: '10px !important',
                      }}
                      >
                        <FormControlLabel classes={{label: classes.label}} value="City" control={<Radio size="small" classes={{root: classes.root}}/>} label="City" />
                        <FormControlLabel classes={{label: classes.label}}  value="Organization" control={<Radio size="small" classes={{root: classes.root}}/>} label="Organization" />
                    </RadioGroup>
                </FormControl>
            </div>
        )
        :
        (
            f.hidden ?
            ''
            :
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
        )
        ;
    });

    return (
        <>
            {filtersHtml}
        </>
    );
}


export default ReviewFilters;

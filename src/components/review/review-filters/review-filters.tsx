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
        paddingTop: 10
    }
}));

interface Props {
    nationState: boolean,
    filters: Array<IReviewFilter>,
    selectFilter: (filterType: FilterTypes, option: DropdownOption) => void,
    deselectFilter: (filterType: FilterTypes) => void
}

const ReviewFilters: FunctionComponent<Props> = (props) => {
    const classes = useStyles();
    const { filters, selectFilter, deselectFilter } = props;
    const [type, setType] = useState<string>('City');
    const [fltr, setFltr] = useState<IReviewFilter []>()
    

    const selectFilterHandler = (filterType: FilterTypes, option: any) => {
        selectFilter(filterType, option); 
    };

    useEffect(()=> {
        if(type === 'City'){
            const f = filters.filter((f)=>f.title !== "Organization");
            setFltr(f)
        } else if(type === 'Organization'){
            const f = filters.filter((f)=>f.title !== "City");
            setFltr(f)
        }
    }, [type])

    
    const filtersHtml = fltr?.map((f:IReviewFilter, i:number) => {

        const disabled = f.options?.length === 0;
        const selectedValue = f.selectedValue === '' ? null : f.selectedValue;
        
        const handleEntityChange = (e:React.ChangeEvent<HTMLInputElement>) => {
            setType((t)=> t = e.target.value)
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
            f.title === type ? (
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
            ): (
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
 
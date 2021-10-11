import React, { FunctionComponent, useState } from 'react'
import DatePicker from "react-datepicker";

interface Props {
    placeholder: string,
    onChange?: (value:string) => void,
}

const FormDatePicker: FunctionComponent<Props> = (props) => {

    const { placeholder, onChange } = props;

    const [startDate, setStartDate] = useState<Date>();

    const changeHandler = (date: Date) => {
        setStartDate(date);

        if(onChange)
            onChange(date.toString());
    }

    return (
        <div className="datepicker">
            <DatePicker
                className="input-text__element"
                placeholderText={placeholder}
                selected={startDate} 
                onChange={changeHandler} 
            />
        </div>

    );
}


export default FormDatePicker;

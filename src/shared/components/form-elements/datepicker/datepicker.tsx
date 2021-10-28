import { FunctionComponent, useState } from 'react'
import DatePicker from "react-datepicker";

interface Props {
    placeholder: string,
    required?: boolean,
    onChange: (value:string, error?: boolean) => void
}

const FormDatePicker: FunctionComponent<Props> = (props) => {

    const { placeholder, required, onChange } = props;

    const [startDate, setStartDate] = useState<Date>();

    const [error, setError] = useState<boolean>(false);

    const changeHandler = (date: Date) => {

        const dateValue = date ?? '';

        setStartDate(dateValue);

        if(required) {
            const err = !dateValue;
            setError(err);

            onChange(dateValue.toString(), err);
        }
        else
            onChange(dateValue.toString());
    }

    return (
        <div className="datepicker">
            <DatePicker
                className={`${error ? 'field-error' : ''} input-text__element`} 
                placeholderText={placeholder}
                selected={startDate} 
                onChange={changeHandler} 
            />
        </div>

    );
}


export default FormDatePicker;

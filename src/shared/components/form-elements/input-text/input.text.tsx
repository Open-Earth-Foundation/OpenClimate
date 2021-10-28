import React, { FunctionComponent, useEffect, useState } from 'react'
import { UseFormRegister } from 'react-hook-form';
import './input.text.scss';

interface Props {
    placeholder: string,
    type?: string,
    required? : boolean,
    onChange: (value:string, error?: boolean) => void
}

const InputText: FunctionComponent<Props> = (props) => {

    const { placeholder, type, required, onChange } = props;

    const [error, setError] = useState<boolean>(false);

    const changeHandler = (e: any) => {
        const value = e.target.value;
        
        if(required) {
            const err = !value;
            setError(err);

            onChange(value, err);
        }
        else
            onChange(value);
    }

    return (
        <div className="input-text">
            <input 
                className={`${error ? 'field-error' : ''} input-text__element`} 
                type={type? type : "text"} 
                onChange={changeHandler}
                placeholder={placeholder} 
            />
        </div>

    );
}


export default InputText;

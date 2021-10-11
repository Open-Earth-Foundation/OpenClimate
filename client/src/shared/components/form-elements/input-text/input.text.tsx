import React, { FunctionComponent } from 'react'
import './input.text.scss';

interface Props {
    placeholder: string,
    onChange?: (value:string) => void,
    type?: string,
    required? : boolean
}

const InputText: FunctionComponent<Props> = (props) => {

    const { placeholder, type, required, onChange } = props;

    return (
        <div className="input-text">
            <input 
                required={required}
                className="input-text__element" 
                type={type? type : "text"} 
                placeholder={placeholder} 
                onChange={onChange ? e => onChange(e.target.value) : undefined}
            />
        </div>

    );
}


export default InputText;

import React, { FunctionComponent, useState } from 'react'
import './input-search.scss';

interface Props {
    className?: string,
    placeholder: string,
    onChangeHandler?: (e:any) => void
}

const InputSearch: FunctionComponent<Props> = (props) => {

    const { className, placeholder, onChangeHandler } = props;

    return (
        <div className="input-search">
            <input 
                className={`input-search__element ${className}`}
                placeholder={placeholder} 
                onChange={onChangeHandler}
            /> 
        </div>
    );
}

export default InputSearch;

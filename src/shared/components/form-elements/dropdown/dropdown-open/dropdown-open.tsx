import React, { FunctionComponent, useEffect, useRef } from 'react'
import { DropdownOption } from '../../../../interfaces/dropdown/dropdown-option';
import InputSearch from '../../input-search/input-search';
import DropdownItem from '../dropdown-item/dropdown-item';
import './dropdown-open.scss';

interface Props {
    options: Array<DropdownOption> | null
    searchPlaceholder: string,
    withSearch: boolean,
    selectHandler: (options: DropdownOption) => void,
    searchHandler: (e: any) => void
}

const DropdownOpen: FunctionComponent<Props> = (props) => {

    const { options, searchPlaceholder, withSearch, searchHandler, selectHandler } = props;

    const items = options?.map(option => {
        return <DropdownItem 
            option={option} 
            key={option.value} 
            selectHandler={() => selectHandler(option)}
            />
    });

    return (
        <div className="dropdown-open">
            {
                withSearch ?
                <div className="dropdown-open__search">
                    <InputSearch 
                        placeholder={searchPlaceholder} 
                        onChangeHandler={searchHandler}
                        className="dropdown__input-search"
                    />
                </div>
                : ""
            }

            <div className="dropdown-open__list">
                {items}
            </div>
            
        </div>
    );
}


export default DropdownOpen;
 
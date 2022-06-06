import React, { FunctionComponent } from 'react'
import { DropdownOption } from '../../../../interfaces/dropdown/dropdown-option';
import './dropdown-item.scss';

interface Props {
    option: DropdownOption,
    selectHandler: (e:any) => void
}

const DropdownItem: FunctionComponent<Props> = (props) => {

    const { option, selectHandler } = props;

    return (
        <div 
            className="dropdown-item" 
            data-value={option.value}
            onClick={selectHandler}
            >
            {option.name}
        </div>
    );
}

export default DropdownItem;
 
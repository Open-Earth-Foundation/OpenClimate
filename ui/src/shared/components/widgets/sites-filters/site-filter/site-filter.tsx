import React, { FunctionComponent, ReactElement, useEffect } from 'react'
import { useState } from 'react';
import CloseIcon from '../../../../img/widgets/close.png';
import './site-filter.scss';

interface Props {
    name: string,
    selected: boolean,
    elementsCount? : number,
    onClick: (selectedOption: string) => void,
    onDeselect?: (selectedOption: string) => void
}

const SiteFilter: FunctionComponent<Props> = (props) => {
    
    const { name, selected, elementsCount, onClick, onDeselect  } = props;
/*
    const dSelected = defaultSelected ? defaultSelected : false;

    const [selected, setSelected] = useState(dSelected);

    const clickHandler = () => {
        const newSelectedState = !selected;

        setSelected(newSelectedState);

        if(onClick)
            onClick(name);
    }
*/
    return (
        <div className="site-filter">
            <div className={`site-filter__filter ${selected? 'site-filter__selected' : ''}`} onClick={e => onClick(name)}>
                <span className="site-filter__filter-name">{`${name} ${elementsCount ? elementsCount : ''}` }</span>
                {selected && onDeselect ? 
                <img src={CloseIcon} alt="deselect" className="deselect-btn" /> 
                : ""   
                }
            </div>
        </div>
    );
}

export default SiteFilter;

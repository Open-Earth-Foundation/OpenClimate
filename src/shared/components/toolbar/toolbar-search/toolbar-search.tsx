import React, { FunctionComponent, useState } from 'react'
import InputSearch from '../../form-elements/input-search/input-search';
import './toolbar-search.scss';

interface Props {
}

const SearchToolbar: FunctionComponent<Props> = (props) => {

    let [showSearchArea, toggleSearchArea] = useState(false);

    return (
        <div className="toolbar__search">
                <InputSearch 
                    className="toolbar__input-search"
                    placeholder="Type to search" 
                /> 
        </div>
    );
}


export default SearchToolbar;

//<img className="toolbar__search-pic" src={SearchIcon} alt="search" onClick={() => toggleSearchArea(true)} />

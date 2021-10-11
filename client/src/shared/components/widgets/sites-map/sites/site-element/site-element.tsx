import React, { FunctionComponent, ReactElement, useState } from 'react'
import SiteFilter from '../../../sites-filters/site-filter/site-filter';
import './site-element.scss';

interface Props {
    name: string,
    location: string,
    onChanged?: (selected: boolean, name: string) => void
}

const SiteElement: FunctionComponent<Props> = (props) => {

    const { name, location, onChanged } = props;

    /*const [selected, setSelected] = useState(false);

    const onChangedHandler = () => {

        const newState = !selected;

        if(onChanged)
            onChanged(newState, name);

        setSelected(newState);
    }*/

    return (
        <div className="widget-sites__site">
            <div className={`widget-sites__site-name`}>{name}</div>
            <div className="widget-sites__site-location">{location}</div>
        </div>
    );
}

export default SiteElement;

/*
        <div className="widget-sites__site" onClick={onChangedHandler}>

            <div className={`widget-sites__site-name ${selected? 'widget-sites__site-name_selected' : ''}`}>{name}</div>
            <div className="widget-sites__site-location">{location}</div>
        </div>
*/
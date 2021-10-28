import React, { FunctionComponent, useState } from 'react'
import './site-element.scss';

interface Props {
    name: string,
    location: string,
    isVisible: boolean,
    onClick?: (selected: boolean, name: string) => void
}

const SiteElement: FunctionComponent<Props> = (props) => {

    const { name, location, isVisible, onClick } = props;

    const [selected, setSelected] = useState(false);

    const onClickHandler = () => {
        const newState = !selected;

        if(onClick)
            onClick(newState, name);

        setSelected(newState);
    }

    if(!isVisible)
        return null;

    return (
        <div className="widget-sites__site" onClick={onClickHandler}>
            <div className={`widget-sites__site-name ${selected? 'widget-sites__site-name_selected' : ''}`}>{name}</div>
            <div className="widget-sites__site-location">{location}</div>
        </div>
    );
}

export default SiteElement;
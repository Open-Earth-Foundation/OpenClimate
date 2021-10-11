import React, { FunctionComponent, ReactElement, useEffect, useState } from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { NavLink } from 'react-router-dom';
import ISite from '../../../../api/models/DTO/Site/ISite';
import WorldwideMap from '../../other/worldwide-map/worldwide-map';
import SitesFiltersWidget from '../sites-filters/sites-filters.widget';
import './sites-map.widget.scss';


interface Props {
    sites?: Array<ISite>,
    detailsLink : string
}

const SitesMapWidget: FunctionComponent<Props> = (props) => {
    const { sites, detailsLink } = props;

    const [displaySites, setDisplaySites] = useState<Array<ISite>>([]);

    useEffect(() => {
        if(sites)
            setDisplaySites(sites);
    } , [sites]);

    const filterChangedHandler = (dspSites: Array<ISite>) => {
        setDisplaySites([...dspSites]);
    }

    return (
        <div className="widget__sites-map-content">
            <div className="sites-map__sites">
                <SitesFiltersWidget
                    sites={sites} 
                    displaySitesChangedHandler = {filterChangedHandler}
                    showCountriesSection={false}
                />
                <div className="sites-map__navigate-link">
                    <NavLink to={detailsLink} className="widget__link">Details</NavLink>
                </div>
            </div>

            <WorldwideMap 
                sites={displaySites}
            />
        </div>
    );
}

export default SitesMapWidget;
/*
                googleMapURL={"https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAfIvsuIw9Kg3z8iWuiyYk55yfjbIFYUSo"}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `282px` }} />}
                mapElement={<div style={{ height: `100%` }} />}

            <Sites 
                sites={sites}
                title="5 sites"
                description="Last updated June 2019"
                detailsLink={detailsLink}
            />

                */
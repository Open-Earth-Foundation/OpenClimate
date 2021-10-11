import React, { FunctionComponent, ReactElement, useEffect, useState } from 'react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import SiteElement from '../sites-map/sites/site-element/site-element';
import './sites-filters.widget.scss';
import ArrowUp from '../../../img/widgets/arrow up.png';
import SiteCollapsible from './site-collapsible/site-collapsible';
import SiteFilter from './site-filter/site-filter';
import ISite from '../../../../api/models/DTO/Site/ISite';

interface Props {
    sites?: Array<ISite>,
    displaySitesChangedHandler: (filteredSites: Array<ISite>) => void,
    showCountriesSection: boolean
}

const SitesFiltersWidget: FunctionComponent<Props> = (props) => {

    const { sites, showCountriesSection, displaySitesChangedHandler } = props; 
    
    const [groupedSites, setGroupedSites] = useState<any>({});

    const [countryTiles, setCountryTiles] = useState<any>([]);

    const [countryFilters, setCountryFilters] = useState<any>([]);

    useEffect(() => {
        if(sites)
        {
            const grSites = sites.reduce(function (site, a) {
                if(a.facility_country)
                {
                    site[a.facility_country] = site[a.facility_country] || [];
                    site[a.facility_country].push(a);
                }
                return site;

            }, Object.create(null));

            setGroupedSites(grSites);

            const tiles: Array<any> = [];
            Object.keys(grSites).map((country: string) => {
                tiles.push({
                    country: country,
                    opened: true,
                    sites: grSites[country],
                    visible: true
                });
            });

            setCountryTiles(tiles);

            const cntrFilters = [
                { name: `All countries`, elementsNumber: sites.length,sites: sites, selected: true }
            ];
            Object.keys(grSites).map((country: string) => {
                cntrFilters.push({
                    name: country,
                    sites: grSites[country],
                    selected: false,
                    elementsNumber: grSites[country].length
                });
            });

            setCountryFilters(cntrFilters);
            
        }        
    }, [sites]);

    const onCountrySelect = (filterName: string) => {
        const updatedCountryFilters = [...countryFilters];

        updatedCountryFilters.map(filter => filter.selected = false);
        updatedCountryFilters.find(filter => filter.name === filterName).selected = true;

        setCountryFilters(updatedCountryFilters);

        let selectedSites:Array<ISite> = [];
        let updatedCountryTiles = [...countryTiles];
        if(filterName.indexOf('All countries') !== -1)
        {
            updatedCountryTiles.forEach((tile: any) => {
                tile.visible = true;
            });

            selectedSites = sites ?? [];
        }
        else
        {

            updatedCountryTiles.forEach((tile: any) => {
                if(tile.country === filterName)
                    tile.visible = true;
                else 
                    tile.visible = false;
            });

            selectedSites = groupedSites[filterName] ?? [];

        }

        setCountryTiles(updatedCountryTiles);
        
        displaySitesChangedHandler(selectedSites);
    }


/*    const onFacilityChangedSelected = (selected: boolean, name: string) => {
        const updateSelectedSites = [...sitesSelectedManually];

        const foundSite = sites?.find(s => s.facility_name === name);

        if(foundSite && selected)
            updateSelectedSites.push(foundSite);
        else if(foundSite && !selected)
            updateSelectedSites.splice(updateSelectedSites.indexOf(foundSite), 1);

        setSitesSelectedManually(updateSelectedSites);

        displaySitesChangedHandler(updateSelectedSites);
    }*/

    return (
        <div className="sites-filters">
            <div className="sites-filters__header">
                <div className="sites-filters__title-wrapper">
                    <h3 className="sites-filters__title">
                        {sites?.length} sites
                    </h3>  
                </div>

                <span className="sites-filters__updated">Last Updated June 2020</span>     

                <div className="sites-filters__filters">
                    <div className="sites-filters__countries">
                        {
                            countryFilters.map((countryFilter: any, index : number) => {
                                
                                return (<SiteFilter 
                                    key={index} 
                                    name={countryFilter.name}
                                    elementsCount={countryFilter.elementsNumber}
                                    selected={countryFilter.selected}
                                    onClick={onCountrySelect}
                                />)
                            })
                        }

                    </div>
                    <div className="sites-filters__types">
                        {
                            
                        //    <SiteFilter name="All types 10" />
                        //<SiteFilter name="Mines" />
                        //<SiteFilter name="Renewable energy" />
                        }
                    </div>
                </div>
            </div>
            {
                showCountriesSection ?
                        <div className="sites-filters__content">
                        {
                            countryTiles.filter((tile: any) => tile.visible)
                                        ?.map((tile: any, index: number) =>
                            <SiteCollapsible 
                                key={index}
                                country={tile.country} 
                                sites={tile.sites} 
                                addBottomBorder={true}
                            />)
                        }
                    </div>
                : ""
            }

        </div>
    );
}

export default SitesFiltersWidget;

import React, { FunctionComponent, useEffect, useState } from 'react'
import SiteCollapsible from './site-collapsible/site-collapsible';
import SiteFilter from './site-filter/site-filter';
import ISite from '../../../../api/models/DTO/Site/ISite';
import './sites-filters.widget.scss';

interface Props {
    sites?: Array<ISite>,
    showCountriesSection: boolean,
    isVisible: boolean,
    displaySitesChangedHandler: (filteredSites: Array<ISite>) => void,
    showModal?: (modalType: string) => void
}

const SitesFiltersWidget: FunctionComponent<Props> = (props) => {

    const { sites, showCountriesSection, isVisible, displaySitesChangedHandler, showModal } = props; 
    
    const [countryTiles, setCountryTiles] = useState<any>([]);

    const [countryFilters, setCountryFilters] = useState<any>([]);

    const [typeFilters, setTypeFilters] = useState<any>([]);

    const [displaySites, setDisplaySites] = useState<Array<ISite>>([]);

    const [sitesSelectedManually, setSitesSelectedManually] = useState<Array<ISite>>([]);

    useEffect(() => {
        
        const grSitesByCountry = getGroupedSites(displaySites, "facility_country");

        const tiles: Array<any> = [];
            Object.keys(grSitesByCountry).map((country: string) => {
                tiles.push({
                    country: country,
                    opened: true,
                    sites: grSitesByCountry[country],
                    visible: true
                });
            });

        setCountryTiles(tiles);

    }, [displaySites]);

    useEffect(() => {
        if(sites)
        {
            setDisplaySites(sites);

            const grSites = getGroupedSites(sites, "facility_country");

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

            const typeFilters = [
                { name: `All types`, elementsNumber: sites.length, sites: sites, selected: true }
            ];

            const grSitesByType = getGroupedSites(sites, "facility_type");

            Object.keys(grSitesByType).map((type: string) => {
                typeFilters.push({
                    name: type,
                    sites: grSitesByType[type],
                    selected: false,
                    elementsNumber: grSitesByType[type].length
                });
            });

            setTypeFilters(typeFilters);

        }        
    }, [sites]);

    const getFilteredSites = () => {
        const selectedCountryFilter = countryFilters.find((cf: any) => cf.selected);
        const selectedTypeFilter = typeFilters.find((tf: any) => tf.selected);

        let selectedSites:Array<ISite> = sites ? [...sites] : [];

        if(selectedCountryFilter.name !== "All countries")
            selectedSites = sites ? sites.filter(s => s.facility_country == selectedCountryFilter.name) : [];
        if(selectedTypeFilter.name !== "All types")
            selectedSites = selectedSites.filter(s => s.facility_type == selectedTypeFilter.name);

        return selectedSites;
    }

    const getGroupedSites = (sites: Array<ISite>, fieldName: string) => {
        const grSitesByCountries = sites.reduce(function (site: any, a: any) {

            if(a[fieldName])
            {
                site[a[fieldName]] = site[a[fieldName]] || [];
                site[a[fieldName]].push(a);
            }
            return site;

        }, Object.create(null));

        return grSitesByCountries;
    }

    const onFilterClickHandler = (filterName: string, filterType: string) => {
        
        let updateFilters = filterType === "Country" ? [...countryFilters] : [...typeFilters];
        updateFilters.map(filter => filter.selected = false);
        updateFilters.find(filter => filter.name === filterName).selected = true;
        
        if(filterType === "Country")
            setCountryFilters(updateFilters);
        else
            setTypeFilters(updateFilters);
        
        const filteredSites = getFilteredSites();

        setDisplaySites(filteredSites);
        displaySitesChangedHandler(filteredSites);

    }

    const onFacilityClickHandler = (selected: boolean, name: string) => {

        const updateSelectedSites = [...sitesSelectedManually];

        const foundSite = sites?.find(s => s.facility_name === name);

        if(foundSite && selected)
            updateSelectedSites.push(foundSite);
        else if(foundSite && !selected)
            updateSelectedSites.splice(updateSelectedSites.indexOf(foundSite), 1);

        setSitesSelectedManually(updateSelectedSites);

        if(updateSelectedSites.length > 0)
            displaySitesChangedHandler(updateSelectedSites);
        else
            displaySitesChangedHandler(displaySites);
    }


    if(!isVisible)
        return null;

    return (
        <div className="sites-filters">
            <div className="sites-filters__header">
                <div className="sites-filters__title-wrapper">
                    <h3 className="sites-filters__title">
                        {sites?.length} sites
                    </h3> 
                    { 
                        showModal ?
                            <button 
                                onClick={() => showModal('add-site-credential')}
                                className="add-new">Add site
                            </button>
                        : ""
                    }
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
                                    onClick={(filterName: string) => onFilterClickHandler(filterName, "Country")}
                                />)
                            })
                        }

                    </div>
                    <div className="sites-filters__types">
                    {
                        typeFilters.map((typeFilter: any, index : number) => {
                            
                            return (<SiteFilter 
                                key={index} 
                                name={typeFilter.name}
                                elementsCount={typeFilter.elementsNumber}
                                selected={typeFilter.selected}
                                onClick={(filterName: string) => onFilterClickHandler(filterName, "Type")}
                            />)
                        })
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
                                    key={`${Date.now()}_${index}`}
                                    country={tile.country} 
                                    sites={tile.sites} 
                                    addBottomBorder={true}
                                    onClickItem={onFacilityClickHandler}
                                />)
                        }
                    </div>
                : ""
            }

        </div>
    );
}

export default SitesFiltersWidget;
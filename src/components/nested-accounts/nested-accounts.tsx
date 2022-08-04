import { FunctionComponent, useEffect, useState } from 'react'
import IAggregatedEmission from '../../api/models/DTO/AggregatedEmission/IAggregatedEmission';
import ISite from '../../api/models/DTO/Site/ISite';
import { AggregatedEmissionHelper } from '../../shared/helpers/aggregated-emission.helper';
import { Fade } from "react-awesome-reveal";
import EmissionWidget from '../../shared/components/widgets/emission/emission.widget';
import IGeoSubnational from '../../api/models/DTO/NestedAccounts/IGeoSubnational';
import ArrowBackIcon from './img/arrow-panel-back.png';
import ClimateActionsPanel from '../account/subpages/account-sites/climate-actions-panel/climate-actions.panel';
import IClimateAction from '../../api/models/DTO/ClimateAction/IClimateActions/IClimateAction';
import MapNestedAccounts from '../../shared/components/other/nested-accounts-map/map-nested-accounts';
import './nested-accounts.scss';
import { ReviewHelper } from '../../shared/helpers/review.helper';
import { EmissionInfo } from '../review/review.page';
import { useLocation } from 'react-router-dom';
import { FilterTypes } from '../../api/models/review/dashboard/filterTypes';
import { DropdownOption } from '../../shared/interfaces/dropdown/dropdown-option';
import ITrackedEntity from '../../api/models/review/entity/tracked-entity';

enum PanelType {
    None,
    Country,
    Subnational,
    Site
}

interface IProps  {
    sites: Array<ISite>,
    aggregatedEmissions: Array<IAggregatedEmission>,
    filterOptions: Array<DropdownOption>
    entityEmission?: IAggregatedEmission,
    entityTitle?: string,
    geoSubnationals: Array<IGeoSubnational>,
    groupedClimateActions: Array<any>,
    loadGeoSubnational: (countryCode: string) => void,
    selectFilter: (filterType: FilterTypes, option: DropdownOption, selectedEntities: Array<ITrackedEntity>) => void,
    loadClimateActions: (siteName: string) => void,
    cleanData: () => void
}

const NestedAccounts: FunctionComponent<IProps> = (props) => {


    const { sites, aggregatedEmissions, geoSubnationals, groupedClimateActions, 
        cleanData, loadClimateActions, loadGeoSubnational, entityEmission, entityTitle, selectFilter, filterOptions} = props;

    const [panelShown, setPanelShown] = useState<boolean>(false);
    const [panelType, setPanelType] = useState<PanelType>(PanelType.None);

    const [summaryEmissions, setSummaryEmissions] = useState<IAggregatedEmission>({
        credential_category: 'Climate Action'
    });

    const [selectedArea, setSelectedArea] = useState<string>();
    const [climateActionSites, setClimateActionSites] = useState<ISite[]>();


    useEffect(() => {
        return () => {
            cleanData();
        }
    }, []);


    const getCountryOption = async (countryName: string) => {
        const countryData = await filterOptions;
        const countryNameToId: Record<string, DropdownOption> = {};
        countryData.map(country => {
            countryNameToId[country.name] = country;
        })
        return countryNameToId[countryName];
    }

    useEffect(() => {
        if(panelShown) {
            loadSiteClimateActions();
        }
    }, [selectedArea, panelShown, panelType]);
    


    const mapWidth = panelShown ? "50%" : "100%";

    const countrySelectedHandler = async (countryName: string) => {
        const countryAggrEmissions = aggregatedEmissions?.filter(ae => ae.facility_country?.toLowerCase() === countryName.toLowerCase());
        const summaryAggrEmissions = AggregatedEmissionHelper.GetSummaryAggregatedEmissions(countryAggrEmissions);
        setSummaryEmissions(summaryAggrEmissions);
        const countryOption = await getCountryOption(countryName);
        countryOption && selectFilter(0, countryOption, []);
        setSelectedArea(countryName);
        setPanelType(PanelType.Country);
    }

    const subnationalSelectedHandler = (subnationalName: string) => {
        if(subnationalName)
        {
            const countryAggrEmissions = aggregatedEmissions?.filter(ae => ae.facility_jurisdiction?.toLowerCase().includes(subnationalName.toLowerCase()));
            const summaryAggrEmissions = AggregatedEmissionHelper.GetSummaryAggregatedEmissions(countryAggrEmissions);
            setSummaryEmissions(summaryAggrEmissions);
        }
        else
            setSummaryEmissions({});


        setSelectedArea(subnationalName);
        setPanelType(PanelType.Subnational);
    }

    const siteSelectedHandler = (siteId: string) => {

        const selectedSite = sites.find(s => s.id === siteId);
        if(selectedSite)
        {
            const siteAggrEmissions = aggregatedEmissions?.find(ae => ae.facility_name === selectedSite.facility_name);
            if(siteAggrEmissions)
                setSummaryEmissions(siteAggrEmissions);
            else {
                setSummaryEmissions({
                    facility_ghg_total_gross_co2e: 0,
                    facility_ghg_total_net_co2e: 0,
                    facility_ghg_total_sinks_co2e: 0
                });
            }

            setSelectedArea(selectedSite.facility_name);
            setPanelType(PanelType.Site);
        }
    }

    const loadSiteClimateActions = () => {
        let sitesClimateActions: Array<ISite> = [];

        switch (panelType)
        {
            case PanelType.Country:
                sitesClimateActions = sites.filter(s => s.facility_country === selectedArea);
                break;
            case PanelType.Subnational:
                sitesClimateActions = sites.filter(s => selectedArea === s.facility_jurisdiction);
                break;
            case PanelType.Site:
                sitesClimateActions = sites.filter(s => s.facility_name === selectedArea);
                break;

        }

        const missedLoadedSitesData = sitesClimateActions.filter(s => s.facility_name && !Object.keys(groupedClimateActions).includes(s.facility_name));

        missedLoadedSitesData.forEach(s => s.facility_name ? loadClimateActions(s.facility_name) : '');

        setClimateActionSites(sitesClimateActions);
    }

    const showPanel = () => {
        setPanelShown(true);
    }

    const hidePanel = () => {
        setPanelShown(false);
    }

    const displayClimateActions = () => {
        let climateActionsSummary: Array<IClimateAction> = [];
        climateActionSites?.forEach(s => {
            if(s.facility_name && Object.keys(groupedClimateActions).length !== 0 && selectedArea && Object.keys(groupedClimateActions).includes(s.facility_name)){
                climateActionsSummary = climateActionsSummary.concat((groupedClimateActions as any)[s.facility_name]);
            }
        });

        return (
            <ClimateActionsPanel
                climateActions={climateActionsSummary}
         />
        );

    }

    return (
        <div className="nested-accounts__content">
            <div className="nested-accounts__map" style={{width: mapWidth}}>
                {
                    <MapNestedAccounts
                        sites={sites}
                        panelShown={panelShown}
                        countrySelectHandler={countrySelectedHandler}
                        subnationalSelectedHandler={subnationalSelectedHandler}
                        siteSelectedHandler={siteSelectedHandler} 
                        geoSubnationals={geoSubnationals}
                        loadGeoSubnational={loadGeoSubnational}
                    />
                }

            </div>
            {
                    panelShown ?
                    <div className="map-panel">
                        <Fade 
                            direction="right"
                            cascade={true}
                            triggerOnce={true}
                            damping={1}
                            fraction={0.2}
                        >
                            <div className="map-panel__wrapper">
                                <div className="map-panel__back nested-accounts__back">
                                    <div className="map-panel__back_link" onClick={() => { hidePanel(); }}>
                                        <img src={ArrowBackIcon} alt="back" className="map-panel__back_icon" />
                                        Close details
                                    </div>
                                </div>  
                                {
                                    displayClimateActions()                                        
                                }
                            </div>
                        </Fade>
                    </div>
                    : ""
                }
            <div className={`nested-accounts__widgets ${panelShown ? 'hidden' : ''}` }>
                {selectedArea ? 
                <Fade>
                    <div className="account-sites__climate-widget-wrapper">
                        <EmissionWidget
                            isVisible={true}
                            aggregatedEmission={entityEmission}
                            title={`Emission Inventory - ${entityTitle ? entityTitle : selectedArea}`}
                            className="sites-climate-action"
                            width={350}
                            height={225}
                            detailsClick={showPanel}
                        />
                    </div>
                </Fade>
                : ''
                }
            </div>
        </div>
    );
}

export default NestedAccounts;
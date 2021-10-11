import React, { FunctionComponent, useEffect, useState } from 'react'
import WorldwideMap from '../../../../shared/components/other/worldwide-map/worldwide-map';
import EmissionWidget from '../../../../shared/components/widgets/emission/emission.widget';
import SitesMapWidget from '../../../../shared/components/widgets/sites-map/sites-map.widget';
import IEmission from '../../../../api/models/review/entity/emission';
import './account-sites.scss';
import OtherCredentialsWidget from '../../../../shared/components/widgets/other-credentials/other-credentials.widget';
import SitesFiltersWidget from '../../../../shared/components/widgets/sites-filters/sites-filters.widget';
import ClimateActionsPanel from './climate-actions-panel/climate-actions.panel';
import ArrowBackIcon from '../../img/arrow-panel-back.png';
import { SitesPanel } from '../../../../api/models/shared/sites-panel';
import { NavLink } from 'react-router-dom';
import { Fade } from "react-awesome-reveal";
import ISite from '../../../../api/models/DTO/Site/ISite';

interface IProps  {
    sites?: Array<ISite>,
    panel?: SitesPanel,
    showModal: (modalType: string) => void
}

const AccountSites: FunctionComponent<IProps> = (props) => {

    const { sites, panel, showModal } = props;
    const [displaySites, setDisplaySites] = useState<Array<ISite>>([]);

    useEffect(() => {
        setDisplaySites(sites ? [...sites] : []);
    }, [sites]);

    const emissionData: IEmission = {
        totalGrossEmissions: 350,
        landUseSinks: 100,
        totalNetEmissions: 250
    }

    let cPanel = null;

    if(panel !== undefined)
    {
        switch(panel) {
            case SitesPanel.ClimateActions:
                cPanel = <ClimateActionsPanel showModal={showModal} />
                break;
        }
    }

    const mapWidth = cPanel ? "50%" : "100%";

    const filterChangedHandler = (dspSites: Array<ISite>) => {
        setDisplaySites([...dspSites]);
    }

    return (
        <div className="account-sites">
            <div className="account-sites__map" style={{width: mapWidth}} onClick={() => showModal('add-site-credential')}>
                <WorldwideMap
                    sites={displaySites}
                />


            </div>
            {
                cPanel ?
                
                    <div className="account-sites__panel">
                        <Fade 
                            direction="right"
                            cascade={true}
                            triggerOnce={true}
                            damping={1}
                            fraction={0.2}
                        >
                            <div className="account-sites__panel-wrapper">
                                <div className="account-sites__panel-back">
                                    <NavLink exact={true} to="/account/sites" className="account-sites__panel-back_link">
                                        <img src={ArrowBackIcon} alt="back" className="account-sites__panel-back_icon" />
                                        Back to all widgets
                                    </NavLink>
                                </div>  
                                {cPanel}
                            </div>
                        </Fade>
                    </div>
                
                : 
                <div className="account-sites__widgets">
                    <Fade>
                        <div className="account-sites__climate-widget-wrapper">
                            <EmissionWidget 
                                emissionData={emissionData}
                                title="Climate actions"
                                className="sites-climate-action"
                                width={320}
                                height={185}
                                detailsLink="/account/sites/climate-actions"
                            />
                            <OtherCredentialsWidget 
                                width={320}
                                height={200}
                            />
                        </div>
                        <div className="account-sites__sites-widget-wrapper">
                            <SitesFiltersWidget 
                                sites={sites} 
                                displaySitesChangedHandler = {filterChangedHandler}
                                showCountriesSection={true}
                            />
                        </div>
                    </Fade>
                </div>
            }
        
        </div>
    );
}

export default AccountSites;

/*
                    googleMapURL={"https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAfIvsuIw9Kg3z8iWuiyYk55yfjbIFYUSo"}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `calc(100vh - 205px)` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
*/
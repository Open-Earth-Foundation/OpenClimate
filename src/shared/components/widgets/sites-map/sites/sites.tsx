import React, { FunctionComponent, ReactElement } from 'react'
import SiteElement from './site-element/site-element';
import './sites.scss';
import EyeIcon from '../../../../img/widgets/eye.png';
import { NavLink } from 'react-router-dom';
import ISite from '../../../../../api/models/DTO/Site/ISite';


interface Props {
    sites?: Array<ISite>,
    title: string,
    description: string,
    detailsLink: string
}

const Sites: FunctionComponent<Props> = (props) => {

    const { sites, title, description, detailsLink } = props;

    const sitesHtml = sites?.map((site: ISite, index: number) => {
        return (
            <SiteElement 
                key={`${site.facility_name}_${index}`}
                name= {site.facility_name ?? ""}
                location= {`${site.facility_country}, ${site.facility_jurisdiction}`}
                isVisible={true}
            />
        )
    });

    return (
        <div className="widget-sites">
            <div className="widget-sites__header">
                <div className="widget-sites__title">{title}</div>
                <div className="widget-sites__description">{description}</div>
            </div>
            <div className="widget-sites__content">
                {sitesHtml}
            </div>
            <div className="widget-sites__explore">
                <NavLink to={detailsLink} className="widget-sites__link">
                    Explore all site
                    <img alt="explore" src={EyeIcon} className="widget-sites__eye-icon" />
                </NavLink>
            </div>
            
        </div>
    );
}

export default Sites;
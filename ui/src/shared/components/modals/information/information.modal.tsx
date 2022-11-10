import React, { FunctionComponent, useState } from 'react'
import Button from '../../form-elements/button/button';
import './information.modal.scss';

interface Props {
    title?: string,
    subtitle?: string
}

const InformationModal: FunctionComponent<Props> = (props) => {

    const { title, subtitle } = props;

    const getDescription = () => {
        switch(title)
        {
            case 'Climate treaties & Agreements':
                return (
                    <div className="information-column__content">
                            This widget shows the Treaties & Agreements that the actor signed or participated in, that are related with Climate action (e.g. Paris Agreement). <p />
                            For each Agreement, it will show the name and status.          
                        </div>
                )
            case 'Your pledges':
                return (
                    <div className="information-column__content">
                        The Pledges widget shows the Commitments the actor made about their Climate Actions (e.g. Nationally Determined Contributions to the Paris Agreement). <p />
                        For each Pledge, it will show name, amount of GHG emissions that the actor wants to reduce and the deadline. 
                    </div>
                )
            case 'Transfers':
                return (
                    <div className="information-column__content">
                        Transfers Widget shows the amount of GHG emissions that were traded or transferred between actors in the form of carbon moving in and out, and carbon reductions (eg. mitigation outcomes in and out). 
                            <p />
                            It includes the actor that had originally this emissions, the actor that received them, and the type of transfer.  
                    </div>
                )
            case 'Total emissions':
                return (
                    <div className="information-column__content">
                        The Emissions Inventory widget includes information about the amount of Greenhouse gases (GHG) that were emitted by the actor.
                            This information includes:
                            <p />
                            - Total GHG emissions Mmt CO2e/year: shows the emissions of all the GHG gases that were emitted by the actor during the last year, calculated in the CO2 equivalent. <p />
                            - Land Use Sinks Mt CO2e/year: shows the all the Land Use Sinks within the actor territory for the last year, calculated in the CO2 equivalent. <p /> 
                    </div>
                )
        }
    }

    return (
        <div className="information">
            <div className="information__title">{title}</div>
            <div className="information__content">
                <div className="information__sub-title">{subtitle}</div>
                <div className="information__content-columns">
                    <div className="information-column">
                        <div className="information-column__title">What does it mean</div>
                        { getDescription() }
                        <div className="information-column__footer">
                            <a href="#" className="information-column__link modal__link modal__link_blue">Read more</a>
                        </div>
                    </div>

                    <div className="information-column">
                        <div className="information-column__title">Data Source</div>
                        <div className="information-column__content">
                        Emissions inventory data has been sourced from UNFCCC annex I through Climate Watch  
                        <a href="#" className="modal__link_blue"> (www.climatewatchdata.org) </a> 
                        on September 12, 2021
                        </div>
                        <div className="information-column__footer">
                            <a href="#" className="information-column__link modal__link modal__link_blue">Learn more about UNFCCC annex I</a>
                            <a href="#" className="information-column__link modal__link modal__link_blue">Learn more about Climate Watch</a>
                        </div>
                    </div>

                    <div className="information-column">
                        <div className="information-column__title">Link Credentials</div>
                        <div className="information-column__content">
                            Credential ID
                            <div className="information-column__credential-id">
                                4f09b684-699d-47b7-96bf-7cdab8d4789b
                            </div>
                        </div>
                        <div className="information-column__footer">
                            <a href="#" className="information-column__link modal__link modal__link_blue">Read more</a>

                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}


export default InformationModal;

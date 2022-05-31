import React, { FunctionComponent, useState } from 'react'
import Button from '../../form-elements/button/button';
import './information.modal.scss';

interface Props {
    title?: string,
    subtitle?: string
}

const InformationModal: FunctionComponent<Props> = (props) => {

    const { title, subtitle } = props;

    return (
        <div className="information">
            <div className="information__title">{title}</div>
            <div className="information__content">
                <div className="information__sub-title">{subtitle}</div>
                <div className="information__content-columns">
                    <div className="information-column">
                        <div className="information-column__title">What does it mean</div>
                        <div className="information-column__content">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam porta nunc id nunc eleifend vestibulum. Cras luctus risus nisi, non dignissim nisi sodales ac. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia...
                        </div>
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

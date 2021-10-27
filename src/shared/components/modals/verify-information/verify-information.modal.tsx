import React, { FunctionComponent, useState } from 'react'
import Button from '../../form-elements/button/button';
import Logo from '../../../img/modals/logo.png';
import './verify-information.modal.scss';

interface Props {
    onModalShow: (entityType:string) => void,
    onModalHide: () => void
}

const VerifyInformationModal: FunctionComponent<Props> = (props) => {

    const { onModalShow, onModalHide } = props;

    return (
        <div className="verify-data">
            <div className="verify-data__title">
                <img src={Logo} alt="logo" className="verify-data__logo"/>
                Company Name
            </div>
            <div className="verify-data__data">
                <div className="verify-data__section">
                    <div className="verify-data__row">
                        <div className="verify-data__left-column">
                            Credential type
                        </div>
                        <div className="verify-data__right-column">
                            Annual GHG Emissions Report
                        </div>
                    </div>
                    <div className="verify-data__row">
                        <div className="verify-data__left-column">
                            Issuer
                        </div>
                        <div className="verify-data__right-column">
                            Ministry of Environment and Climate Change Strategy
                        </div>
                    </div>
                </div>

                <div className="verify-data__section">
                    <div className="verify-data__row">
                        <div className="verify-data__section_title">
                            Organization
                        </div>
                    </div>
                    <div className="verify-data__row">
                        <div className="verify-data__left-column">
                            Registration
                        </div>
                        <div className="verify-data__right-column">
                            Registration info
                        </div>
                    </div>
                    <div className="verify-data__row">
                        <div className="verify-data__left-column">
                            Registration ID
                        </div>
                        <div className="verify-data__right-column">
                            1889123847180184
                        </div>
                    </div>
                </div>

                <div className="verify-data__section">
                    <div className="verify-data__row">
                        <div className="verify-data__section_title">
                            Attributes
                        </div>
                    </div>
                    <div className="verify-data__row">
                        <div className="verify-data__left-column">
                            Facility Name
                        </div>
                        <div className="verify-data__right-column">
                            Name
                        </div>
                    </div>
                    <div className="verify-data__row">
                        <div className="verify-data__left-column">
                            Facility Location
                        </div>
                        <div className="verify-data__right-column">
                            Location
                        </div>
                    </div>
                    <div className="verify-data__row">
                        <div className="verify-data__left-column">
                            Primary Activity NAICS Code & Description
                        </div>
                        <div className="verify-data__right-column">
                            Description
                        </div>
                    </div>
                </div>

                <div className="verify-data__section">
                    <div className="verify-data__row">
                        <div className="verify-data__section_title">
                            Scope I Emissions (Grand Total Emissions)
                        </div>
                    </div>
                    <div className="verify-data__row">
                        <div className="verify-data__left-column">
                            CO2 fossil Emissions
                        </div>
                        <div className="verify-data__right-column">
                            145
                        </div>
                    </div>
                    <div className="verify-data__row">
                        <div className="verify-data__left-column">
                            CO2 Biomass Emissions
                        </div>
                        <div className="verify-data__right-column">
                            14
                        </div>
                    </div>
                    <div className="verify-data__row">
                        <div className="verify-data__left-column">
                            CH4 Emissions
                        </div>
                        <div className="verify-data__right-column">
                            22
                        </div>
                    </div>
                    <div className="verify-data__row">
                        <div className="verify-data__left-column">
                            N20 Emissions
                        </div>
                        <div className="verify-data__right-column">
                            10
                        </div>
                    </div>
                    <div className="verify-data__row">
                        <div className="verify-data__left-column">
                            HFCs Emissions
                        </div>
                        <div className="verify-data__right-column">
                            13
                        </div>
                    </div>
                    <div className="verify-data__row">
                        <div className="verify-data__left-column">
                            PFCs Emissions
                        </div>
                        <div className="verify-data__right-column">
                            33
                        </div>
                    </div>
                    <div className="verify-data__row">
                        <div className="verify-data__left-column">
                            SF6 Emissions   
                        </div>
                        <div className="verify-data__right-column">
                            0
                        </div>
                    </div>
                </div>

                <div className="verify-data__section">
                    <div className="verify-data__row">
                            <div className="verify-data__left-column">
                                Verification Body
                            </div>
                            <div className="verify-data__right-column">
                                Some text
                            </div>
                        </div>
                        <div className="verify-data__row">
                            <div className="verify-data__left-column">
                                Verification Result
                            </div>
                            <div className="verify-data__right-column">
                                Some text
                            </div>
                        </div>
                        <div className="verify-data__row">
                            <div className="verify-data__left-column">
                                Reporting Year
                            </div>
                            <div className="verify-data__right-column">
                                2021
                            </div>
                        </div>
                </div>
                
                <div className="verify-data__section">
                    <div className="verify-data__row">
                            <div className="verify-data__left-column">
                                Credential Effective Date
                            </div>
                            <div className="verify-data__right-column">
                                19.12.2021
                            </div>
                        </div>
                        <div className="verify-data__row">
                            <div className="verify-data__left-column">
                                Credential Issue Date
                            </div>
                            <div className="verify-data__right-column">
                                19.12.2021
                            </div>
                        </div>
                        <div className="verify-data__row">
                            <div className="verify-data__left-column">
                                Timeline
                            </div>
                            <div className="verify-data__right-column">
                                -
                            </div>
                        </div>
                </div>
            </div>

            <div className="modal__row modal__row_btn">
                <Button 
                        click={onModalHide}
                        color="primary"
                        text="Confirm"
                        type="button"
                        />
            </div>
            <div className="modal__row modal__row_btn">
                <Button 
                        click={() => onModalShow('login-credential')}
                        color="white"
                        text="Rescan"
                        type="button"
                        />
            </div>
            <div className="modal__row modal__options modal__row_content-center">
                <button 
                        onClick={() => onModalShow('report-credential')}
                        className="modal__link modal__link_black ">There's and Issue with this information
                </button>
            </div>
        </div>

    );
}


export default VerifyInformationModal;
/*
                                <label className="verify-data__label">Issuer</label>
                                <span>Ministry of Environment and Climate Change Strategy</span>

                                <label className="verify-data__label">Credential type</label>
                                <span>Annual GHG Emissions Report</span>

 <form action="/" className="registration-form">
                    <div className="modal__content modal__content-btm-mrg">

                    </div>
                    
                    <div className="modal__row modal__row_btn">
                        <Button color="primary"
                                text="Register"
                                type="button"
                                />
                    </div>
                    
                    <div className="modal__row modal__options modal__row_content-center">
                        <button 
                                className="modal__link modal__link_black ">There's and Issue with this information
                        </button>
                    </div>
                </form>
*/
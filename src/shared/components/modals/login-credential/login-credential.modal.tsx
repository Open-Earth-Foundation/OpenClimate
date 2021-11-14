import React, { FunctionComponent, useState } from 'react'
import Button from '../../form-elements/button/button';
import Modal from '../modal/modal';
// import CredentialPic from '../../../img/modals/credential-qrcode.png';
import QR from 'qrcode.react'
import './login-credential.modal.scss';

interface Props {
    onModalShow: (modalType: string) => void
}

const LoginCredentialModal: FunctionComponent<Props> = (props) => {
    if (!props.QRCodeURL) {
      props.sendRequest('INVITATIONS', 'CREATE_SINGLE_USE', {})
    }

    const { onModalShow } = props;

    return (
        <form action="/" className="login-credential-form">
            <div className="modal__content login-credential-form__qr-content">
                <div className="modal__row modal__row_content-center login-credential-form__qrcode">
                    {/* <img src={CredentialPic} alt="QRcode" /> */}
                    {props.QRCodeURL ? (
                    <div className="qr">
                        <p>
                        <QR
                            value={props.QRCodeURL}
                            size={300}
                            renderAs="svg"
                        />
                        </p>
                    </div>
                    ) : (
                    <p>
                        <span>Loading...</span>
                    </p>
                    )}
                </div>
                <div className="modal__row modal__row_content-center login-credential-form__qr-content">
                    Scan QR code with your credential wallet
                </div>
                <div className="modal__row modal__row_content-center login-credential-form__tutorial-link">
                    <a href="#" className="modal__link modal__link_blue">
                        How does it work?
                    </a>
                </div>
                <div className="modal__row modal__row_btn">
                    <Button color="white"
                            click={() => onModalShow('demo-info')}
                            text="Use Demo Access"
                            type="button"
                            />
                </div>
                <div className="modal__row modal__row_content-center">
                    <a
                        onClick={() => onModalShow('verify-information')}
                        className="modal__link modal__link_black">Skip for later
                    </a>
                </div>
            </div>
        </form>
    );
}


export default LoginCredentialModal;
/*


                        <div className="modal__row  modal__options login-credential-form__options">
                            <div>
                                <span>No credential?</span>
                                <a 
                                        onClick={onRegistrationShow}
                                        className="modal__link modal__link_blue">Register
                                </a>
                            </div>
                            <div>
                                <a 
                                    onClick={onLoginShow}
                                    className="modal__link modal__link_black">Log In with password
                                </a>
                            </div>
                        </div>
*/
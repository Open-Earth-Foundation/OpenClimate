import React, { FunctionComponent, useState } from 'react'
import Button from '../../form-elements/button/button';
import { useTheme } from 'styled-components'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Modal from '../modal/modal';
// import CredentialPic from '../../../img/modals/credential-qrcode.png';
import QR from 'qrcode.react';
import './login-credential.modal.scss';
import InputText from '../../form-elements/input-text/input.text';
import {
    useNotification
  } from '../../../../UI/NotificationProvider';

interface Props {
    onModalShow: (modalType: string) => void,
    hideModal: () => void,
}  

const LoginCredentialModal: FunctionComponent<Props> = (props) => {
    const [requestedInvitation, setRequestedInvitation] = useState(false)
    const [userEmail, setUserEmail] = useState<string>('');

    if (!props.QRCodeURL && !requestedInvitation) {
      props.sendRequest('INVITATIONS', 'CREATE_SINGLE_USE', {})
      setRequestedInvitation(true)
    }
    const setNotification = useNotification()
    const { onModalShow, hideModal} = props;

    return (
        <form action="/" className="login-credential-form">
            <div className="modal__content login-credential-form__qr-content">
                <div className="modal__row modal__row_content-center login-credential-form__qr-content login-credential-form__subheader">
                        Scan this QR with your digital wallet to login. You will have to complete the request for proof of credentials
                </div>

                <div className="modal__row modal__row_content-center login-credential-form__tutorial-link">
                    <a href="#" className="modal__link modal__link_blue">
                    <InfoOutlinedIcon className={"login-credential-form__info-icon"} fontSize="inherit" />How does this work?
                    </a>
                </div>
                
                
                <div className="modal__row modal__row_content-center">
                    {/* <img src={CredentialPic} alt="QRcode" /> */}
                    {props.QRCodeURL ? (
                    <div className="login-credential-form__qrcode">
                        <QR
                            value={props.QRCodeURL}
                            size={250}
                            renderAs="svg"
                        />
                    </div>
                    ) : (
                    <p>
                        <span>Loading...</span>
                    </p>
                    )}
                </div>

                <div className="modal__row modal__row_content-center login-credential-form__qr-content">
                    <a onClick={() => {
                        navigator.clipboard.writeText(props.QRCodeURL) 
                        alert("Link copied to clipboard!")}} 
                        className="modal__link modal__link_primary"
                        >
                            <div className="login-credential-form__copy-link">
                                <ContentCopyIcon className={"login-credential-form__info-icon"} />Copy link
                            </div>
                    </a>
                </div>

                {/* <div className="modal__row modal__row_content-center login-credential-form__qr-content login-credential-form__subheader login-credential-form__second-subheader">
                        or you can use the Demo Access if you don't have a verified credential yet.
                </div> */}
                
                
                {/* <div className="modal__row modal__row_btn">
                    <Button color="white"
                            click={() => onModalShow('demo-info')}
                            text="Use Demo Access"
                            type="button"
                            />
                </div> */}
                {/* <div className="modal__row modal__row_content-center">
                    <a
                        onClick={() => onModalShow('verify-information')}
                        className="modal__link modal__link_black">Skip for later
                    </a>
                </div> */}
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
import React, { FunctionComponent, useState } from 'react'
import Button from '../../form-elements/button/button';
import InputText from '../../form-elements/input-text/input.text';
import './login.modal.scss';
import Axios from 'axios';
import {
    useNotification
  } from '../../../../UI/NotificationProvider';

interface Props {
    onModalShow: (modalType: string) => void,
    onLogin: (email: string, password: string, demo: boolean) => void,
    setLoggedIn: (e: boolean) => void,
    setUpUser: (id: any, email: any, roles: any) => void,
    hideModal: () => void,
    handlePasswordLogin: (email: string, password: string, setNotification: any) => void,
    loginError: string
}

const LoginModal: FunctionComponent<Props> = (props) => {
    const { onModalShow, onLogin, loginError, setLoggedIn, setUpUser, hideModal, handlePasswordLogin} = props;
    const setNotification = useNotification()
    const [userEmail, setUserEmail] = useState<string>('');
    const [userPassword, setUserPassword] = useState<string>('');
    const [showErrors, setShowErrors] = useState<boolean>(false);
    let err = ''
    const loginHandler = async () => {
        await handlePasswordLogin(userEmail, userPassword, setNotification)
        hideModal()
    }

    return (
        <form autoComplete="off" action="/" className="login-form">
            <div className="modal__content modal__content-btm-mrg">
                <div className="modal__row modal__row_content">
                    <InputText 
                        type="email"
                        placeholder="Email" 
                        onChange={setUserEmail}
                        />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText 
                        type="Password"
                        placeholder="Password" 
                        onChange={setUserPassword}
                    />
                </div>
                {
                    showErrors && loginError ? 
                        <span role="alert">
                            Invalid credentials. Please try again.
                        </span> 
                    : ''
                }
            </div>

            <div className="modal__row modal__row_btn">
                <Button color="primary"
                        text="Log In"
                        type="button"
                        click={loginHandler}
                        />
            </div>
            <div className="modal__row modal__row_btn">
                <Button color="white"
                        text="Log In With Credentials"
                        type="button"
                        click={()=>onModalShow('login-credential')}
                        />
            </div>

            <div className="modal__row modal__row_btn modal__options">
                <div> 
                    <a 
                        className="modal__link modal__link_black">Forgot password?
                    </a>
                </div>
            </div>
        </form>
    );
}


export default LoginModal;

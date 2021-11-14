import React, { FunctionComponent, useState } from 'react'
import Button from '../../form-elements/button/button';
import InputText from '../../form-elements/input-text/input.text';
import Modal from '../modal/modal';
import './registration.modal.scss';
import { userService } from '../../../services/user.service';
import { IUser } from '../../../../api/models/User/IUser';


interface Props {
    onModalShow: (entityType:string) => void
}

const RegistrationModal: FunctionComponent<Props> = (props) => {

    const { onModalShow } = props;

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreed, setAgreed] = useState(false);

    const handleSubmit = (event: any) => {
        event.preventDefault();

        const newUser: IUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        }

        userService.register(newUser).then(response => {
            if(response.ok) {
              // TO DO: Retrieve roles from session
              const indicioUser = {
                email: newUser.email,
                roles: [1]
              }

              props.sendRequest('USERS', 'CREATE', indicioUser)

              onModalShow('login');
            }
        });
    }

    return (

        <form action="/" className="registration-form" onSubmit={handleSubmit}>
            <div className="modal__content modal__content-btm-mrg">
                <div className="modal__row modal__row_content">
                    <InputText 
                        onChange={(val: string) => setFirstName(val)}
                        placeholder = "Enter your first name"
                        required={true}   
                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText 
                        onChange={(val: string) => setLastName(val)}
                        placeholder="Enter your last name" 
                        required={true}
                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText 
                        type="email"
                        onChange={(val: string) => setEmail(val)}
                        placeholder="Enter your email" 
                        required={true}
                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText 
                        onChange={(val: string) => setPassword(val)}
                        type="password"
                        placeholder="Password" 
                        required={true}
                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText 
                        onChange={(val: string) => setConfirmPassword(val)}
                        type="password"
                        placeholder="Confirm Password" 
                        required={true}
                    />
                </div>
                <div className="modal__row modal__row_content modal__row_content-center">
                    <label>
                        <input type="checkbox" className="modal__checkbox" onChange={() => setAgreed(!agreed)} />
                        I agree with the <a className="modal__link modal__link_blue">privacy policy</a>
                    </label>
                </div>
            </div>
            
            <div className="modal__row modal__row_btn">
                <Button color="primary"
                        text="Register"
                        type="submit"
                        disabled={!agreed}
                        />
            </div>
            <div className="modal__row modal__options modal__row_content-center">
                    <button 
                            onClick={() => onModalShow('login')}
                            className="modal__link modal__link_blue ">I already have an account
                    </button>
            </div>
        </form>

    );
}


export default RegistrationModal;

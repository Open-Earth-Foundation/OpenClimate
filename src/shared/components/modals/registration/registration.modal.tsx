import React, { FunctionComponent, useState } from 'react'
import Button from '../../form-elements/button/button';
import InputText from '../../form-elements/input-text/input.text';
import Modal from '../modal/modal';
import './registration.modal.scss';
import { userService } from '../../../services/user.service';
import { IUser } from '../../../../api/models/User/IUser';
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';

interface Props {
    onModalShow: (entityType:string) => void
}

const RegistrationModal: FunctionComponent<Props> = (props) => {

    const { onModalShow } = props;

    const { formState, register,  handleSubmit } = useForm();

    const onSubmit = (data: any) => {

        //const password = data["password"];
        //const confirm_password = data["confirm_password"];

        const newUser: IUser = {
            firstName: data["first_name"],
            lastName: data["last_name"],
            email:  data["email"],
            password:  data["password"]
        }

        userService.register(newUser).then(response => {
            if(response.ok) {
                onModalShow('login');
                toast("User registered successfully");
            }
        });
    }

    return (

        <form autoComplete="off" action="/" className="registration-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="modal__content modal__content-btm-mrg">
                <div className="modal__row modal__row_content">
                    <InputText 
                        type="text"
                        placeholder="* Enter your first name"
                        register={register}
                        label="first_name"
                        required={true}
                        errors={formState.errors['first_name']}
                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText 
                        type="text"
                        placeholder="* Enter your last name"
                        register={register}
                        label="last_name"
                        required={true}
                        errors={formState.errors['last_name']}
                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText 
                        type="email"
                        placeholder="* Enter your email"
                        register={register}
                        label="email"
                        required={true}
                        errors={formState.errors['email']}
                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText 
                        type="password"
                        placeholder="* Password"
                        register={register}
                        label="password"
                        required={true}
                        errors={formState.errors['password']}
                    />
                </div>
                <div className="modal__row modal__row_content modal__row_content-center">
                    <input  
                        type="checkbox" 
                        className={`checkbox-primary ${formState.errors['form-signed'] ? 'is-empty' : ''}` }
                        {...register('form-signed', { required: true })}
                    />
                    <div className="privacy-policy">
                        I agree with the 
                        <a href="#" className="modal__link modal__link_blue"> privacy policy</a>
                    </div>


                </div>
            </div>
            
            <div className="modal__row modal__row_btn">
                <Button color="primary"
                        text="Register"
                        type="submit"
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
/*
                <div className="modal__row modal__row_content">
                    <InputText 
                        type="password"
                        placeholder="* Confirm Password"
                        register={register}
                        label="confirm_password"
                        required={true}
                        errors={formState.errors['confirm_password']}
                    />
                </div>
*/
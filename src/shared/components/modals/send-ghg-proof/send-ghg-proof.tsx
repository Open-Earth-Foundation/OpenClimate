import React, { FunctionComponent, useState, useEffect } from 'react'
import Button from '../../form-elements/button/button';
import './send-ghg-proof.modal.scss';
import Dropdown from '../../form-elements/dropdown/dropdown';
import { DropdownOption } from '../../../interfaces/dropdown/dropdown-option';
import { useForm, Controller } from "react-hook-form";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
    useNotification
  } from '../../../../UI/NotificationProvider';
import { IUser } from '../../../../api/models/User/IUser';

interface Props {
    onModalHide: () => void,
    onModalShow: (entityType: string, parameters?: object) => void,
    scope1: any,
    user: IUser | null,
}

const SendGHGCredModal: FunctionComponent<Props> = (props) => {

    const { onModalHide, onModalShow, scope1, user } = props;
    const [userEmail, setUserEmail] = useState<string>('');
    const [userWallet, setUserWallet] = useState<string>('');
    const [requestedInvitation, setRequestedInvitation] = useState(false)
    const setNotification = useNotification()
    const [connectionLink, setConnectionLink] = useState<string>('');
    
    async function requestWalletInvitation() {
        if (!requestedInvitation) {
            console.log("User", user)
            props.sendRequest('INVITATIONS', 'CREATE_WALLET_INVITATION', {userID: user.id})
            setRequestedInvitation(true)
          }
    }
   

    async function pushPresentationRequestHandler() {
        const user = {
            email: userEmail,
        }
        console.log("User email", user)
        props.sendRequest('PRESENTATION', 'PUSH', {email: "pavelkrolevets@gmail.com"})
        setNotification(
            `Presentation request sent`,
            'notice'
          )
    }
    const wallets = [{'name':'did:sov:1234'}, {'name':'did:sov:4321'}]
    const { formState, register,  handleSubmit, setValue, control } = useForm();
    
    if (props.scope1) {
        console.log("Scope 1", props.scope1)
        onModalShow('accept-ghg-proof', { scope1: props.scope1 })
      }

    return (
        <div className="add-ghg-cred__content">
            <div className="add-ghg-cred__content_row">
                <div className="add-ghg-cred__btn_row">
                    <Dropdown
                        withSearch={false}
                        options={wallets.map(w=> {return {name: w.name, value: w.name} as DropdownOption})}
                        title=""
                        emptyPlaceholder="* Business Wallet"
                        selectedValue={wallets[0].name}
                        onSelect={(option: DropdownOption) => setUserWallet(option.value)}
                        register={register}
                        label="select_wallet_did"
                        required={true}
                        setValue={setValue}
                    /> 
                    <div className="modal__row login-credential-form__qr-content">
                    <a onClick={async () => {
                        await requestWalletInvitation()
                        if (props.QRCodeURL){
                            navigator.clipboard.writeText(props.QRCodeURL) 
                            alert("Link copied to clipboard!")}} 
                        }
                        className="modal__link modal__link_primary"
                        >
                            <div className="login-credential-form__copy-link">
                                <ContentCopyIcon className={"login-credential-form__info-icon"} />Request invitation to connect
                            </div>
                    </a>
                    </div>
                    <div style={{margin: 25}}>
                        <Button 
                                click={() => pushPresentationRequestHandler()}
                                color="primary"
                                text="Send proof request to wallet"
                                type="button"
                        />
                    </div>
                  

                </div>
                <div className="add-ghg-cred__btn_row">
                    <p>Steps to connect data</p>
                </div>
            </div>
        </div>

    );
}


export default SendGHGCredModal;

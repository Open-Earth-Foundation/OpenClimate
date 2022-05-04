import React, { FunctionComponent, useState } from 'react'
import Button from '../../form-elements/button/button';
import './send-ghg-proof.modal.scss';
import Dropdown from '../../form-elements/dropdown/dropdown';
import { DropdownOption } from '../../../interfaces/dropdown/dropdown-option';
import { useForm, Controller } from "react-hook-form";

interface Props {
    onModalHide: () => void,
    onModalShow: (entityType: string, parameters?: object) => void,
}

const SendGHGCredModal: FunctionComponent<Props> = (props) => {

    const { onModalHide, onModalShow } = props;
    const [userEmail, setUserEmail] = useState<string>('');
    const [userWallet, setUserWallet] = useState<string>('');
    async function pushPresentationRequestHandler() {
        const user = {
            email: userEmail,
        }
        console.log("User email", user)
        props.sendRequest('PRESENTATION', 'PUSH', {email: "pavelkrolevets@gmail.com"})
    }
    const wallets = [{'name':'did:sov:1234'}, {'name':'did:sov:4321'}]
    const { formState, register,  handleSubmit, setValue, control } = useForm();

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
                    <Button 
                            click={() => pushPresentationRequestHandler()}
                            color="primary"
                            text="Send proof request to wallet"
                            type="button"
                    />

                </div>
                <div className="add-ghg-cred__btn_row">
                    <p>Steps to connect data</p>
                </div>
            </div>
        </div>

    );
}


export default SendGHGCredModal;

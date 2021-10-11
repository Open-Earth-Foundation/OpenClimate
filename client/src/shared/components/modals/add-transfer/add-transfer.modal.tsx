import React, { FunctionComponent, useState } from 'react'
import { toast } from 'react-toastify';
import { DropdownOption } from '../../../interfaces/dropdown/dropdown-option';
import { transferService } from '../../../services/transfer.service';
import Button from '../../form-elements/button/button';
import Dropdown from '../../form-elements/dropdown/dropdown';
import InputText from '../../form-elements/input-text/input.text';
import DatePicker from "react-datepicker";
import FormDatePicker from '../../form-elements/datepicker/datepicker';
import { IUser } from '../../../../api/models/User/IUser';
import ITransfer from '../../../../api/models/DTO/Transfer/ITransfer';

interface Props {
    user: IUser | null,
    onModalHide: () => void,
    addTransfer: (transfer: any) => void

}

const AddTransferModal: FunctionComponent<Props> = (props) => {

    const { user, onModalHide, addTransfer } = props;
    
    const [transferData, setTransferData] = useState<ITransfer>({
        credential_category: "Transfers",
        credential_type: "Transfer Report",
        credential_issuer: "OpenClimate"
    });

    const formChangeHandler = (name: string, value: string) => {
        setTransferData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const submitHandler = (e: any) => {
        e.preventDefault();
        
        const transfer = {
            ...transferData,
            credential_issue_date: Date.now()
        }

        if(user)
        {
            transfer.organization_name = user.company?.name;
            transfer.signature_name = `${user.name}`;
            //todo
        }

        //todo facility

        transferService.saveTransfer(transfer).then(transfer => {
            addTransfer(transfer);
            onModalHide();
            toast("Transfer successfully created");
        });
    }

    return (
        <form action="/" className="transfer-form" onSubmit={submitHandler}>
             <div className="modal__content modal__content-btm-mrg">
                <div className="modal__row modal__row_content">
                    <FormDatePicker 
                      placeholder="Date"
                      onChange={(dateStr: string) => formChangeHandler("transfer_date", dateStr)}
                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText 
                        type="text"
                        placeholder="Project or Site" 
                        onChange={(value: string) => formChangeHandler("facility_name", value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText 
                        type="text"
                        placeholder="Sector" 
                        onChange={(value: string) => formChangeHandler("facility_sector_ipcc_category", value)}
                    />
                </div>
                <div className="modal__row modal__row_content">
                    <Dropdown 
                        withSearch={false}
                        options={null}
                        title=""
                        emptyPlaceholder="Type"
                        onSelect={(option: DropdownOption) => formChangeHandler("transfer_goods", option.value)}
                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText 
                        type="text"
                        placeholder="Quantity" 
                        onChange={(value: string) => formChangeHandler("transfer_quantity", value)}
                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText 
                        type="text"
                        placeholder="Unit" 
                        onChange={(value: string) => formChangeHandler("transfer_quantity_unit", value)}
                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText 
                        type="text"
                        placeholder="Carbon associated (tn CO2eq)" 
                        onChange={(value: string) => formChangeHandler("transfer_carbon_associated", value)}
                    />
                </div>
                <div className="modal__row modal__row_content">
                    <Dropdown 
                        withSearch={false}
                        options={null}
                        title=""
                        emptyPlaceholder="Carbon intensity credential"
                        onSelect={(option: DropdownOption) => formChangeHandler("transfer_carbon_intensity", option.value)}

                    />
                </div>
                <div className="modal__row modal__row_content">
                    <Dropdown 
                        withSearch={false}
                        options={null}
                        title=""
                        emptyPlaceholder="Reciever"
                        onSelect={(option: DropdownOption) => formChangeHandler("transfer_receiver_organization", option.value)}

                    />

                    
                    <a href="#" className="transfer-form__link modal__link modal__link_blue modal__form-link">
                        Invite to connect through Open Climate (coming soon)
                    </a>
                </div>
                <div className="modal__row modal__row_content">
                    <InputText 
                        type="text"
                        placeholder="Corresponding Adjustment (coming soon)" 
                        onChange={(value: string) => formChangeHandler("transfer_receiver_jurisdiction", value)}

                    />
                </div>
                <div className="transfer-form__sign-as modal__row modal__row_content">
                    <input type="checkbox" className="transfer-form__checkbox checkbox-primary" />
                    Sign as 
                    <a href="#"> {user?.email} </a>
                    in representation of 
                    <a href="#"> {user?.company?.name}</a>
                </div>
            </div>

            <div className="modal__row modal__row_btn">
                <Button color="primary"
                        text="Submit Transfer"
                        type="submit"
                        />
            </div>
            <div className="modal__row modal__row_btn">
                <Button color="white"
                        text="Cancel"
                        type="button"
                        click={onModalHide}

                        />
            </div>
        </form>
    );
}


export default AddTransferModal;

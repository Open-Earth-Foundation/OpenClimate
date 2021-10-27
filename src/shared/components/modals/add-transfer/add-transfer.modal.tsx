import React, { FunctionComponent, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { DropdownOption } from '../../../interfaces/dropdown/dropdown-option';
import { transferService } from '../../../services/transfer.service';
import Button from '../../form-elements/button/button';
import Dropdown from '../../form-elements/dropdown/dropdown';
import InputText from '../../form-elements/input-text/input.text';
import FormDatePicker from '../../form-elements/datepicker/datepicker';
import { IUser } from '../../../../api/models/User/IUser';
import ITransfer from '../../../../api/models/DTO/Transfer/ITransfer';
import ISite from '../../../../api/models/DTO/Site/ISite';
import { CountryCodesHelper } from '../../../helpers/country-codes.helper';
import { FilterTypes } from '../../../../api/models/review/dashboard/filterTypes';

interface Props {
    user: IUser | null,
    sites: Array<ISite>,
    onModalHide: () => void,
    addTransfer: (transfer: any) => void

}

const AddTransferModal: FunctionComponent<Props> = (props) => {

    const { user, sites, onModalHide, addTransfer } = props;

    const [countryOptions, setCountryOptions] = useState<Array<DropdownOption>>([]);
    const [subnationalOptions, setSubnationalOptions] = useState<Array<DropdownOption>>([]);

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

        const foundSite = sites.find(f => f.facility_name === transfer.facility_name);
        if (foundSite) {
            transfer.facility_country = foundSite.facility_country;
            transfer.facility_jurisdiction = foundSite.facility_jurisdiction; 
            transfer.facility_location = foundSite.facility_location; 
            transfer.facility_sector_ipcc_activity = foundSite.facility_sector_ipcc_activity;
            transfer.facility_sector_ipcc_category = foundSite.facility_sector_ipcc_category;
            transfer.facility_sector_naics = foundSite.facility_sector_naics;
            transfer.facility_type = foundSite.facility_type;
        }

        transferService.saveTransfer(transfer).then(transfer => {
            addTransfer(transfer);
            onModalHide();
            toast("Transfer successfully created");
        });
    }

    useEffect(()=>{
        setCountryOptions(CountryCodesHelper.GetContryOptions());

    }, []);

    const countryChangeHandler = (option:DropdownOption) => {
        formChangeHandler("transfer_receiver_country", option.name);
        const suboptions = CountryCodesHelper.GetOptions(FilterTypes.SubNational, option.value);
        setSubnationalOptions(suboptions);
    }

    return (
        <form action="/" className="transfer-form" onSubmit={submitHandler}>
             <div className="modal__content modal__content-btm-mrg">
                <div className="modal__row modal__row_content">
                    <Dropdown
                            withSearch={false}
                            options={sites.map(s=> {return {name: s.facility_name, value: s.facility_name} as DropdownOption})}
                            title=""
                            emptyPlaceholder="Site"
                            onSelect={(option: DropdownOption) => formChangeHandler("facility_name", option.value)}
                    /> 
                </div> 
                <div className="modal__row modal__row_content">
                    <FormDatePicker 
                      placeholder="Date"
                      onChange={(dateStr: string) => formChangeHandler("transfer_date", dateStr)}
                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText 
                        type="text"
                        placeholder="Type" 
                        onChange={(value: string) => formChangeHandler("transfer_goods", value)}
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
                    <InputText 
                        type="text"
                        placeholder="Carbon intensity credential" 
                        onChange={(value: string) => formChangeHandler("transfer_carbon_intensity", value)}
                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText 
                        type="text"
                        placeholder="Carbon intensity credential Id" 
                        onChange={(value: string) => formChangeHandler("transfer_carbon_intensity_credential_id", value)}
                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText 
                        type="text"
                        placeholder="Reciever" 
                        onChange={(value: string) => formChangeHandler("transfer_receiver_organization", value)}
                    />
                    
                    <a href="#" className="transfer-form__link modal__link modal__link_blue modal__form-link">
                        Invite to connect through Open Climate (coming soon)
                    </a>
                </div>
                <div className="modal__row modal__row_content">
                    <Dropdown
                        withSearch={true}
                        options={countryOptions}
                        title=""
                        emptyPlaceholder="Country"
                        onSelect={countryChangeHandler}
                    /> 
                </div>
                <div className="modal__row modal__row_content">
                     <Dropdown
                         withSearch={false}
                         options={subnationalOptions}
                         title=""
                         emptyPlaceholder="Subnational"
                         onSelect={(option:DropdownOption) => {formChangeHandler("transfer_receiver_jurisdiction", option.value)}}
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

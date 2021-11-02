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
import { useForm } from 'react-hook-form';

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
    const [agreed, setAgreed] = useState(false);

    const [errors, setErrors] = useState<Array<any>>([
        "facility_name",
        "transfer_date",
        "transfer_goods",
        "transfer_quantity",
        "transfer_quantity_unit",
        "transfer_carbon_associated",
        "transfer_receiver_country",
        "transfer_receiver_organization"
    ]);

    const [transferData, setTransferData] = useState<ITransfer>({
        credential_category: "Transfers",
        credential_type: "Transfer Report",
        credential_issuer: "OpenClimate"
    });

    const formChangeHandler = (name: string, value: string, err?: boolean) => {

        if(err && !errors.includes(name))
            setErrors([...errors, name]);
        else {
            const updErrors = errors.filter(e => e !== name);
            setErrors(updErrors);
        }

        setTransferData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const submitHandler = (e: any) => {
        e.preventDefault();
        
        if(!user || !user.company || !user.company.id)
           return;

        const transfer = {
            ...transferData,
            credential_issue_date: Date.now()
        }

        transfer.organization_name = user.company?.organization_name;
        transfer.signature_name = `${user.name}`;
        //todo

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

        const attributes = [
            {
                name: 'credential_category',
                value: 'Transfers',
            },
            {
                name: 'credential_type',
                value: 'Transfer Report',
            },
            {
                name: 'credential_name',
                value: 'Transfers',
            },
            {
                name: 'credential_schema_id',
                value: 'WFZtS6jVBp23b4oDQo6JXP:2:Transfers:1.0',
            },
            {
                name: 'credential_issuer',
                value: 'OpenClimate',
            },
            {
                name: 'credential_issue_date',
                value: transfer.credential_issue_date.toString(),
            },
            {
                name: 'organization_name',
                value: transfer.organization_name,
            },
            {
                name: 'organization_category',
                value: '',
            },
            {
                name: 'organization_type',
                value: '',
            },
            {
                name: 'organization_credential_id',
                value: '',
            },
            {
                name: 'facility_name',
                value: transfer.facility_name,
            },
            {
                name: 'facility_country',
                value: transfer.facility_country,
            },
            {
                name: 'facility_jurisdiction',
                value: transfer.facility_jurisdiction || '',
            },
            {
                name: 'facility_location',
                value: transfer.facility_location,
            },
            {
                name: 'facility_sector_ipcc_category',
                value: transfer.facility_sector_ipcc_category || '',
            },
            {
                name: 'facility_sector_ipcc_activity',
                value: transfer.facility_sector_ipcc_activity || '',
            },
            {
                name: 'facility_sector_naics',
                value: transfer.facility_sector_naics || '',
            },
            {
                name: 'transfer_date',
                value: transfer.transfer_date.toString(),
            },
            {
                name: 'transfer_goods',
                value: transfer.transfer_goods,
            },
            {
                name: 'transfer_quantity',
                value: transfer.transfer_quantity,
            },
            {
                name: 'transfer_quantity_unit',
                value: transfer.transfer_quantity_unit,
            },
            {
                name: 'transfer_carbon_intensity',
                value: transfer.transfer_carbon_intensity,
            },
            {
                name: 'transfer_carbon_intensity_credential_id',
                value: transfer.transfer_carbon_intensity_credential_id,
            },
            {
                name: 'transfer_carbon_associated',
                value: transfer.transfer_carbon_associated,
            },
            {
                name: 'transfer_receiver_organization',
                value: transfer.transfer_receiver_organization,
            },
            {
                name: 'transfer_receiver_country',
                value: transfer.transfer_receiver_country,
            },
            {
                name: 'transfer_receiver_jurisdiction',
                value: transfer.transfer_receiver_jurisdiction || '',
            },
            {
                name: 'signature_name',
                value: transfer.signature_name || '',
            }
        ]

        console.log(JSON.stringify(attributes))
        
        let newCredential = {
          connectionID: props.loggedInUserState.connection_id,
          schemaID: 'WFZtS6jVBp23b4oDQo6JXP:2:Transfers:1.0',
          schemaVersion: '1.0',
          schemaName: 'Transfers',
          schemaIssuerDID: 'WFZtS6jVBp23b4oDQo6JXP',
          comment: '',
          attributes: attributes,
        }
        
        if (props.loggedInUserState.connection_id) {
            props.sendRequest('CREDENTIALS', 'ISSUE_USING_SCHEMA', newCredential)
        }
        
        transferService.saveTransfer(user.company.id, transfer).then(transfer => {
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

    const countryDeselectHandler = (name: string, err?: boolean) => {
        formChangeHandler(name, '', err);
        setSubnationalOptions([]);
    }

    return (
        <form action="/" className="transfer-form" onSubmit={submitHandler}>
             <div className="modal__content modal__content-btm-mrg">
                <div className="modal__row modal__row_content">
                    <Dropdown
                        withSearch={false}
                        options={sites.map(s=> {return {name: s.facility_name, value: s.facility_name} as DropdownOption})}
                        title=""
                        emptyPlaceholder="* Facility name"
                        onSelect={(option: DropdownOption) => formChangeHandler("facility_name", option.value)}
                        onDeSelect={(err?: boolean) => formChangeHandler("facility_name", '', err)}
                        required
                    /> 
                </div> 
                <div className="modal__row modal__row_content">
                    <FormDatePicker 
                      placeholder="* Date"
                      onChange={(dateStr: string, err?: boolean) => formChangeHandler("transfer_date", dateStr, err)}
                      required
                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText 
                        type="text"
                        placeholder="* Type" 
                        onChange={(value: string, err?: boolean) => formChangeHandler("transfer_goods", value, err)}
                        required
                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText 
                        type="text"
                        placeholder="* Quantity" 
                        onChange={(value: string, err?: boolean) => formChangeHandler("transfer_quantity", value, err)}
                        required
                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText 
                        type="text"
                        placeholder="* Unit" 
                        onChange={(value: string, err?: boolean) => formChangeHandler("transfer_quantity_unit", value, err)}
                        required
                    />
                </div>
                <div className="modal__row modal__row_content">
                    <InputText 
                        type="text"
                        placeholder="* Carbon associated (tn CO2eq)" 
                        onChange={(value: string, err?: boolean) => formChangeHandler("transfer_carbon_associated", value, err)}
                        required
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
                        placeholder="* Receiver organization" 
                        onChange={(value: string, err?: boolean) => formChangeHandler("transfer_receiver_organization", value, err)}
                        required
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
                        emptyPlaceholder="* Receiver Country"
                        onSelect={countryChangeHandler}
                        onDeSelect={(err?: boolean) => countryDeselectHandler("transfer_receiver_country", err)}
                        required
                    /> 
                </div>
                <div className="modal__row modal__row_content">
                     <Dropdown
                         withSearch={false}
                         options={subnationalOptions}
                         title=""
                         emptyPlaceholder="Receiver Jurisdiction"
                         onSelect={(option:DropdownOption) => {formChangeHandler("transfer_receiver_jurisdiction", option.value)}}
                     />
                 </div>
                <div className="transfer-form__sign-as modal__row modal__row_content">
                    <input type="checkbox" className="transfer-form__checkbox checkbox-primary" onChange={() => setAgreed(!agreed)} />
                    Sign as 
                    <a href="#"> {user?.email} </a>
                    in representation of 
                    <a href="#"> {user?.company?.organization_name}</a>
                </div>
            </div>

            <div className="modal__row modal__row_btn">
                <Button color="primary"
                        text="Submit Transfer"
                        type="submit"
                        disabled={errors.length > 0 || !agreed}
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

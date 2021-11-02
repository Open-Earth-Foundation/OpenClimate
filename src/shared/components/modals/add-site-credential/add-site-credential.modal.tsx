import React, { FunctionComponent, useState } from 'react'
import Dropdown from '../../form-elements/dropdown/dropdown';
import InputText from '../../form-elements/input-text/input.text';
import Button from '../../form-elements/button/button';
import { CountryCodesHelper } from '../../../helpers/country-codes.helper';
import { DropdownOption } from '../../../interfaces/dropdown/dropdown-option';
import { FilterTypes } from '../../../../api/models/review/dashboard/filterTypes';
import { siteService } from '../../../services/site.service';
import { toast } from 'react-toastify';
import { SiteTypes } from '../../../../api/data/shared/site-types';
import { IUser } from '../../../../api/models/User/IUser';
import ISite from '../../../../api/models/DTO/Site/ISite';

interface Props {
    user: IUser | null,
    onModalHide: () => void,
    addSite: (site: ISite) => void,
    submitButtonText: string
}

const AddSiteCredentialModal: FunctionComponent<Props> = (props) => {

    const { user, submitButtonText, onModalHide, addSite } = props;

    const [subnationalOptions, setSubnationalOptions] = useState<Array<DropdownOption>>([]);

    const [site, setSite] = useState<ISite>({ 
        credential_category: "Facility",
        credential_type: "Facility Information"
    });

    const countryOptions = CountryCodesHelper.GetContryOptions();

    const typesOptions = SiteTypes.map(s => {
        return {
            name: s,
            value: s
        }
    });

    const countryChangeHandler = (option:DropdownOption) => {
        formChangeHandler("facility_country", option.name);
        const suboptions = CountryCodesHelper.GetOptions(FilterTypes.SubNational, option.value);
        setSubnationalOptions(suboptions);
    }

    const formChangeHandler = (name: string, value: string) => {
        const updateSite = {
            ...site,
            [name]: value
        };

        setSite(updateSite);
    }

    const submitHandler = (e: any) => {

        e.preventDefault();
        console.log ("User before", user)
        if(!user || !user.company || !user.company.id)
            return;
        console.log ("User after", user)

        setSite({
            ...site,
            credential_issue_date: Date.now(),
            credential_issuer: "OpenClimate",
            organization_name: user.company.organization_name,
            signature_name: `${user.name}`
        });

        siteService.saveSite(user.company.id, site).then(site => {
            addSite(site);
            onModalHide();
            toast("Site successfully created");
        });

        return;
    }

     return (
         <form action="/" className="pledge-form" onSubmit={submitHandler}>
             <div className="modal__content modal__content-btm-mrg">

                <div className="modal__row modal__row_content">
                    <input 
                        className="form-input"
                        type="text"
                        placeholder="Facility Name"
                        onChange={e => formChangeHandler("facility_name", e.target.value)}
                    />
                 </div>
                 <div className="modal__row modal__row_content">
                     <Dropdown
                         withSearch={false}
                         options={typesOptions}
                         title=""
                         emptyPlaceholder="Facility Type"
                         onSelect={(option:DropdownOption) => {formChangeHandler("facility_type", option.value)}}
                     />
                 </div>
                 <div className="modal__row modal__row_content">
                     <Dropdown
                         withSearch={true}
                         options={countryOptions}
                         title=""
                         emptyPlaceholder="Facility Country"
                         onSelect={countryChangeHandler}
                     />
                 </div>
                 <div className="modal__row modal__row_content">
                     <Dropdown
                         withSearch={false}
                         options={subnationalOptions}
                         title=""
                         emptyPlaceholder="Facility Jurisdiction"
                         onSelect={(option:DropdownOption) => {formChangeHandler("facility_jurisdiction", option.value)}}
                     />
                 </div>
                 <div className="modal__row modal__row_content">
                    <input 
                        className="form-input"
                        type="text"
                        placeholder="Facility Location"
                        onChange={e => formChangeHandler("facility_location", e.target.value)}
                    />
                 </div>
                 <div className="modal__row modal__row_content">
                    <input 
                        className="form-input"
                        type="text"
                        placeholder="Facility IPCC Category"
                        onChange={e => formChangeHandler("facility_sector_ipcc_category", e.target.value)}
                    />
                 </div>
                 <div className="modal__row modal__row_content">
                    <input 
                        className="form-input"
                        type="text"
                        placeholder="Facility IPCC Activity"
                        onChange={e => formChangeHandler("facility_sector_ipcc_activity", e.target.value)}
                    />
                 </div>
                 <div className="modal__row modal__row_content">
                    <input 
                        className="form-input"
                        type="text"
                        placeholder="Facility NAICS Sector"
                        onChange={e => formChangeHandler("facility_sector_naics", e.target.value)}
                    />
                 </div>
             </div>
         <div className="modal__row modal__row_btn">
                <Button color="primary"
                         text={submitButtonText}
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


export default AddSiteCredentialModal;

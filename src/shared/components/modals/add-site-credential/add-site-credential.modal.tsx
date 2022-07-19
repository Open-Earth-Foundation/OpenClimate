import React, { FunctionComponent, useState, useEffect } from 'react'
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
import { ReviewHelper } from '../../../helpers/review.helper';
import { useForm } from 'react-hook-form';


interface Props {
    user: IUser | null,
    onModalHide: () => void,
    addSite: (site: ISite) => void,
    submitButtonText: string
}

const AddSiteCredentialModal: FunctionComponent<Props> = (props) => {

    const { user, submitButtonText, onModalHide, addSite } = props;

    const [countryOptions, setCountryOptions] = useState<Array<DropdownOption>>([]);
    const [subnationalOptions, setSubnationalOptions] = useState<Array<DropdownOption>>([]);

    const [typesOptions, setTypesOptions] = useState<Array<any>>([]);

    const { formState, register,  handleSubmit, setValue } = useForm();

    useEffect(()=>{
        setCountryOptions(CountryCodesHelper.GetCountryOptionsForSite());

        const typesOptions = SiteTypes.map(s => {
            return {
                name: s,
                value: s
            }
        });
        setTypesOptions(typesOptions);

    }, []);

    const countryChangeHandler = async (option:DropdownOption) => {
        const countryCode2 = CountryCodesHelper.GetCountryAlpha2(option.value);
        const suboptions = await ReviewHelper.GetOptions(FilterTypes.SubNational, countryCode2);
        setSubnationalOptions(suboptions);
    }

    const countryDeselectHandler = () => {
        setSubnationalOptions([]);
    }

    const submitHandler = (data: any) => {
        console.log("Submit click", user)
        if(!user || !user.company || !user.company.organization_id)
            return;

        delete data['form-signed']

        const countryName = CountryCodesHelper.GetCountryNameByAlpha3(data['facility_country']);
        data['facility_country'] = countryName;

        const jurisdiction = CountryCodesHelper.GetRegionNameByCode(data['facility_jurisdiction']);
        data['facility_jurisdiction'] = jurisdiction;

        const dbSite = {...data};

        dbSite.credential_category = "Facility";
        dbSite.credential_type = "Facility Information";
        dbSite.credential_issue_date = Date.now();
        dbSite.credential_issuer = "OpenClimate";
        dbSite.organization_name = user.company.name;
        dbSite.signature_name =  `${user.email}`;

        siteService.saveSite(user.company.organization_id, dbSite).then(site => {
            addSite(site);
            onModalHide();
            toast("Site successfully created");
        });

        return;
    }

     return (
         <form autoComplete="off" action="/" className="pledge-form" onSubmit={handleSubmit(submitHandler)}>
             <div className="modal__content modal__content-btm-mrg">

                <div className="modal__row modal__row_content">
                    <InputText 
                        type="text"
                        placeholder="* Facility Name"
                        register={register}
                        label="facility_name"
                        required={true}
                        errors={formState.errors['facility_name']}
                    />
                 </div>
                 <div className="modal__row modal__row_content">
                    <Dropdown 
                        withSearch={false}
                        options={typesOptions}
                        title=""
                        emptyPlaceholder="* Facility Type"
                        register={register}
                        label="facility_type"
                        required={true}
                        errors={formState.errors['facility_type']}
                        setValue={setValue}
                    />
                 </div>
                 <div className="modal__row modal__row_content">
                    <Dropdown 
                        withSearch={true}
                        options={countryOptions}
                        title=""
                        emptyPlaceholder="* Facility Country"
                        onSelect={countryChangeHandler}
                        onDeSelect={() => countryDeselectHandler()}
                        register={register}
                        label="facility_country"
                        required={true}
                        errors={formState.errors['facility_country']}
                        setValue={setValue}
                    />
                 </div>
                 <div className="modal__row modal__row_content">
                    <Dropdown 
                        withSearch={false}
                        options={subnationalOptions}
                        title=""
                        emptyPlaceholder="Facility Jurisdiction"
                        register={register}
                        label="facility_jurisdiction"
                        required={false}
                        errors={formState.errors['facility_jurisdiction']}
                        setValue={setValue}
                    />
                 </div>
                 <div className="modal__row modal__row_content">
                    <InputText 
                        type="text"
                        placeholder="Facility Location"
                        register={register}
                        label="facility_location"
                        required={false}
                        errors={formState.errors['facility_location']}
                    />
                 </div>
                 <div className="modal__row modal__row_content">
                    <InputText 
                        type="text"
                        placeholder="Facility Bounds"
                        register={register}
                        label="facility_bounds"
                        required={false}
                        errors={formState.errors['facility_bounds']}
                    />
                 </div>
                 <div className="modal__row modal__row_content">
                    <InputText 
                        type="text"
                        placeholder="Facility IPCC Category"
                        register={register}
                        label="facility_sector_ipcc_category"
                        required={false}
                        errors={formState.errors['facility_sector_ipcc_category']}
                    />
                 </div>
                 <div className="modal__row modal__row_content">
                    <InputText 
                        type="text"
                        placeholder="Facility IPCC Activity"
                        register={register}
                        label="facility_sector_ipcc_activity"
                        required={false}
                        errors={formState.errors['facility_sector_ipcc_activity']}
                    />
                 </div>
                 <div className="modal__row modal__row_content">
                    <InputText 
                        type="text"
                        placeholder="Facility NAICS Sector"
                        register={register}
                        label="facility_sector_naics"
                        required={false}
                        errors={formState.errors['facility_sector_naics']}
                    />
                 </div>
                 <div className="transfer-form__sign-as modal__row modal__row_content">
                        <input  
                            type="checkbox" 
                            className={`transfer-form__checkbox checkbox-primary ${formState.errors['form-signed'] ? 'is-empty' : ''}` }
                            {...register('form-signed', { required: true })}
                        />
                        Sign as 
                        <a href="#"> {user?.email} </a>
                        in representation of 
                        <a href="#"> {user?.company?.name}</a>
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

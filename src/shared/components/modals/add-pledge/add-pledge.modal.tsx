import React, { forwardRef, FunctionComponent, useEffect, useState } from 'react'
import { DropdownOption } from '../../../interfaces/dropdown/dropdown-option';
import Button from '../../form-elements/button/button';
import Dropdown from '../../form-elements/dropdown/dropdown';
import InputText from '../../form-elements/input-text/input.text';
import './add-pledge.modal.scss';
import { pledgeService } from '../../../services/pledge.service';
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { IUser } from '../../../../api/models/User/IUser';
import IPledge from '../../../../api/models/DTO/Pledge/IPledge';
import { PledgeSchemas } from '../../../../api/data/shared/pledge-schemas';

interface Props {
    user: IUser | null,
    onModalHide: () => void,
    addPledge: (pledge: any) => void
}

export interface IFormValues {
    Target: string;
    "Target year": string;
}

const AddPledgeModal: FunctionComponent<Props> = (props) => {

    const { user, onModalHide, addPledge } = props;
    
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    
    const [target, setTarget] = useState("");
    const [pledgeSchemas, setPledgeSchemas] = useState<any>([]);
    const [targetOptions, setTargetOptions] = useState<Array<DropdownOption>>([]);

    const [pledge, setPledge] = useState<IPledge>({ credential_category: "Pledges" });
    
    useEffect(() => {
        if(!pledgeSchemas.length) {

            setPledgeSchemas(PledgeSchemas);
            const options = PledgeSchemas?.map((rf:any) => {
                return {
                    name: rf["display_name"],
                    value: rf["type"],
                }
            });

            setTargetOptions(options);
        }
    }, []);


    const formChangeHandler = (name: string, value: string) => {
        const updatePledge = {
            ...pledge,
            [name]: value
        };
        setPledge(updatePledge);

       /* setPledgeData(prevState => ({
            ...prevState,
            [name]: value
        }));*/
    }


    const targetChangedHandler = (option: DropdownOption) => {
        formChangeHandler("credential_type", option.value);
        setTarget(option.value);
    }

    const submitHandler = (data: any) => {

        pledge.credential_issue_date = Date.now();
        pledge.credential_issuer = "OpenClimate";

        pledgeService.savePledge(pledge).then(pledge => {
            addPledge(pledge);
            onModalHide();
            toast("Pledge successfully created");
        });

        return;
/*
        let valid = true;

        const elements =  [...e.target.elements];
        
        elements.map((element: any) => {
            if(element.required && !element.value && !element.className.includes("field-error"))
                element.className += " field-error";
        });

        elements.map((element: any)=> {
            if(element.className.includes("field-error"))
                valid = false;
        });

        if(!valid)
            return;
*/
       /* const pledge = {
            ...pledgeData,
            Updated: Date.now()
        }*/


    }

    let extraFields = [];
    if(pledgeSchemas.length && target) {
        
        const pledgeSchema = pledgeSchemas.find((ps: any) => ps["type"] === target);

        extraFields = pledgeSchema["fields"]?.map((ps: any, index: number) => {

        //const cOptions = ps.options as Array<DropdownOption> ?? null;

        return (
            <div className="modal__row modal__row_content" key={index}>
            {ps.type === "text" ?
                <input 
                    className="form-input"
                    //{...register(ps.name, { required: true })}
                    type="text"
                    placeholder={ps.placeholder}
                    onChange={e => formChangeHandler(ps.name, e.target.value)}
                />
                :""
                /*<Dropdown 
                    options={cOptions}
                    title=""
                    withSearch={false}
                    onSelect={(option: DropdownOption) => formChangeHandler(ps.name, option.value)}
                    emptyPlaceholder={ps.name}
                />*/
            }
            
        </div>
        );
    });
    }
    
    return (

        <form action="/" className="pledge-form" onSubmit={handleSubmit(submitHandler)} noValidate>

            <div className="modal__content modal__content-btm-mrg">
                <div className="modal__row modal__row_content">
                    <input 
                        className="form-input"
                        {...register("Target year", { required: true })}
                        type="text"
                        placeholder="Target year"
                        onChange={e => formChangeHandler("pledge_target_year", e.target.value)}
                    />
                    {errors["Target year"] && <span>This field is required</span>}
                </div>
                <div className="modal__row modal__row_content">
                    <Dropdown 
                        withSearch={false}
                        options={targetOptions}
                        title=""
                        emptyPlaceholder="Target"
                        onSelect={(option: DropdownOption) => targetChangedHandler(option)}
                        onDeSelect={() => setTarget("")} 
                        // {...register("Target")}
                        register={register}
                    />
                    
                </div>
                {extraFields}            

                {extraFields.length ? 
                    <div className="transfer-form__sign-as modal__row modal__row_content">
                        <input type="checkbox" className="transfer-form__checkbox checkbox-primary" />
                        Sign as 
                        <a href="#"> {user?.email} </a>
                        in representation of 
                        <a href="#"> {user?.company?.name}</a>
                    </div>
                    : ""
                }

            </div>

            <div className="modal__row modal__row_btn">
                <Button color="primary"
                        text="Save"
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


export default AddPledgeModal;

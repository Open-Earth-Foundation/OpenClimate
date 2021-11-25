import React, { FunctionComponent, useEffect, useState } from 'react'
import { DropdownOption } from '../../../interfaces/dropdown/dropdown-option';
import Button from '../../form-elements/button/button';
import Dropdown from '../../form-elements/dropdown/dropdown';
import InputText from '../../form-elements/input-text/input.text';
import './add-pledge.modal.scss';
import { pledgeService } from '../../../services/pledge.service';
import { toast } from 'react-toastify';
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

    const [target, setTarget] = useState("");
    const [pledgeSchemas, setPledgeSchemas] = useState<any>([]);
    const [targetOptions, setTargetOptions] = useState<Array<DropdownOption>>([]);

    const [pledge, setPledge] = useState<IPledge>({ credential_category: "Pledges" });

    const [errors, setErrors] = useState<Array<any>>([
        "pledge_target_year",
        "pledge_target"
    ]);

    useEffect(() => {
        if (!pledgeSchemas.length) {

            setPledgeSchemas(PledgeSchemas);
            const options = PledgeSchemas?.map((rf: any) => {
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
    }


    const targetChangedHandler = (option: DropdownOption) => {
        formChangeHandler("credential_type", option.value);
        setTarget(option.value);
    }

    const submitHandler = (e: any) => {

        e.preventDefault();

        if (!user || !user.company || !user.company.organization_credential_id)
            return;

        pledge.credential_issue_date = Date.now();
        pledge.credential_issuer = "OpenClimate";
        pledge.organization_name = user.company.organization_name;
        pledge.signature_name = `${user.firstName} ${user.lastName}`;

        console.log(pledge)
        console.log(pledge.credential_type)

        let attributes_1 = [
            {
                name: 'credential_category',
                value: 'Pledges',
            },
            {
                name: 'credential_type',
                value: pledge.credential_type || '',
            },
            {
                name: 'credential_name',
                value: 'Site_Facility'
            },
            {
                name: 'credential_schema_id',
                value: 'WFZtS6jVBp23b4oDQo6JXP:2:Carbon_Intensity:1.0',
            },
            {
                name: 'credential_issuer',
                value: 'OpenClimate',
            },
            {
                name: 'credential_issue_date',
                value: pledge.credential_issue_date.toString(),
            },
            {
                name: 'organization_name',
                value: pledge.organization_name || '',
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
                name: 'pledge_target_year',
                value: pledge.pledge_target_year,
            },
            {
                name: 'pledge_target',
                value: '',
            }
        ]

        let attributes_2 = []

        if (pledge.credential_type === 'Target Emission Reduction Pledge') {
            attributes_2 = [
                {
                    name: 'pledge_base_year',
                    value: pledge.pledge_base_year,
                },
                {
                    name: 'pledge_base_level',
                    value: pledge.pledge_base_level,
                },
                {
                    name: 'pledge_plan_details',
                    value: pledge.pledge_plan_details,
                },
                {
                    name: 'pledge_public_statement',
                    value: pledge.pledge_public_statement,
                },
                {
                    name: 'signature_name',
                    value: pledge.signature_name || '',
                }
            ]

            const attributes = attributes_1.concat(attributes_2)

            let newCredential = {
                connectionID: props.loggedInUserState.connection_id,
                schemaID: 'WFZtS6jVBp23b4oDQo6JXP:2:Pledge_Target_emission_reduction:1.0',
                schemaVersion: '1.0',
                schemaName: 'Pledge_Target_emission_reduction',
                schemaIssuerDID: 'WFZtS6jVBp23b4oDQo6JXP',
                comment: '',
                attributes: attributes,
            }

            console.log(newCredential)
            console.log(newCredential.attributes)

            if (props.loggedInUserState.connection_id) {
                props.sendRequest('CREDENTIALS', 'ISSUE_USING_SCHEMA', newCredential)
            }
        } else if (pledge.credential_type === 'Target Carbon Intensity Reduction Pledge') {
            attributes_2 = [
                {
                    name: 'pledge_base_year',
                    value: pledge.pledge_base_year,
                },
                {
                    name: 'pledge_base_level',
                    value: pledge.pledge_base_level,
                },
                {
                    name: 'pledge_plan_details',
                    value: pledge.pledge_plan_details,
                },
                {
                    name: 'pledge_public_statement',
                    value: pledge.pledge_public_statement,
                },
                {
                    name: 'signature_name',
                    value: pledge.signature_name || '',
                }
            ]

            const attributes = attributes_1.concat(attributes_2)

            let newCredential = {
                connectionID: props.loggedInUserState.connection_id,
                schemaID: 'WFZtS6jVBp23b4oDQo6JXP:2:Pledge_Carbon_Intensity_Reduction:1.0',
                schemaVersion: '1.0',
                schemaName: 'Pledge_Carbon_Intensity_Reduction',
                schemaIssuerDID: 'WFZtS6jVBp23b4oDQo6JXP',
                comment: '',
                attributes: attributes,
            }

            console.log(newCredential)
            console.log(newCredential.attributes)

            if (props.loggedInUserState.connection_id) {
                props.sendRequest('CREDENTIALS', 'ISSUE_USING_SCHEMA', newCredential)
            }
        } else if (pledge.credential_type === 'Target Carbon Intensity Level Pledge') {
            attributes_2 = [
                {
                    name: 'pledge_plan_details',
                    value: pledge.pledge_plan_details,
                },
                {
                    name: 'pledge_public_statement',
                    value: pledge.pledge_public_statement,
                },
                {
                    name: 'signature_name',
                    value: pledge.signature_name || '',
                }
            ]

            const attributes = attributes_1.concat(attributes_2)

            let newCredential = {
                connectionID: props.loggedInUserState.connection_id,
                schemaID: 'WFZtS6jVBp23b4oDQo6JXP:2:Pledge_Carbon_Intensity_level:1.0',
                schemaVersion: '1.0',
                schemaName: 'Pledge_Carbon_Intensity_level',
                schemaIssuerDID: 'WFZtS6jVBp23b4oDQo6JXP',
                comment: '',
                attributes: attributes,
            }

            console.log(newCredential)
            console.log(newCredential.attributes)

            if (props.loggedInUserState.connection_id) {
                props.sendRequest('CREDENTIALS', 'ISSUE_USING_SCHEMA', newCredential)
            }
        } else if (pledge.credential_type === 'Target Emission Level Pledge') {
            attributes_2 = [
                {
                    name: 'pledge_commitment_type',
                    value: pledge.pledge_commitment_type || '',
                },
                {
                    name: 'pledge_plan_details',
                    value: pledge.pledge_plan_details,
                },
                {
                    name: 'pledge_public_statement',
                    value: pledge.pledge_public_statement,
                },
                {
                    name: 'signature_name',
                    value: pledge.signature_name || '',
                }
            ]

            const attributes = attributes_1.concat(attributes_2)

            let newCredential = {
                connectionID: props.loggedInUserState.connection_id,
                schemaID: 'WFZtS6jVBp23b4oDQo6JXP:2:Pledge_Target_emission_level:1.0',
                schemaVersion: '1.0',
                schemaName: 'Pledge_Target_emission_level',
                schemaIssuerDID: 'WFZtS6jVBp23b4oDQo6JXP',
                comment: '',
                attributes: attributes,
            }

            console.log(newCredential)
            console.log(newCredential.attributes)

            if (props.loggedInUserState.connection_id) {
                props.sendRequest('CREDENTIALS', 'ISSUE_USING_SCHEMA', newCredential)
            }
        }

        pledgeService.savePledge(user.company.id, pledge).then(pledge => {
            addPledge(pledge);
            onModalHide();
            toast("Pledge successfully created");
        });

        return;

    }

    let extraFields = [];
    if (pledgeSchemas.length && target) {

        const pledgeSchema = pledgeSchemas.find((ps: any) => ps["type"] === target);

        extraFields = pledgeSchema["fields"]?.map((ps: any, index: number) => {

            return (
                <div className="modal__row modal__row_content" key={index}>
                    {ps.type === "text" ?
                        <input
                            className="form-input"
                            type="text"
                            placeholder={ps.placeholder}
                            onChange={e => formChangeHandler(ps.name, e.target.value)}
                        />
                        : ""
                    }

                </div>
            );
        });
    }

    return (

        <form action="/" className="pledge-form" onSubmit={submitHandler} noValidate>

            <div className="modal__content modal__content-btm-mrg">
                <div className="modal__row modal__row_content">
                    <InputText
                        type="text"
                        placeholder="Target year"
                        onChange={(value: string) => formChangeHandler("pledge_target_year", value)}
                        required
                    />
                </div>
                <div className="modal__row modal__row_content">
                    <Dropdown
                        withSearch={false}
                        options={targetOptions}
                        title=""
                        emptyPlaceholder="Target"
                        onSelect={(option: DropdownOption) => targetChangedHandler(option)}
                        onDeSelect={() => setTarget("")}
                        required
                    />

                </div>
                {extraFields}

                {extraFields.length ?
                    <div className="transfer-form__sign-as modal__row modal__row_content">
                        <input type="checkbox" className="transfer-form__checkbox checkbox-primary" />
                        Sign as
                        <a href="#"> {user?.email} </a>
                        in representation of
                        <a href="#"> {user?.company?.organization_name}</a>
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

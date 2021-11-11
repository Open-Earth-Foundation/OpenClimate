import React, { FunctionComponent, useEffect, useState } from 'react'
import { climateActionService } from '../../../services/climate-action';
import { toast } from 'react-toastify';
import { DropdownOption } from '../../../interfaces/dropdown/dropdown-option';
import IClimateAction from '../../../../api/models/DTO/ClimateAction/IClimateActions/IClimateAction';
import { ClimateActionTypes } from '../../../../api/models/DTO/ClimateAction/climate-action-types';
import { ClimateActionScopes } from '../../../../api/models/DTO/ClimateAction/climate-action-scopes';
import ISite from '../../../../api/models/DTO/Site/ISite';
import { AggregatedEmissionHelper } from '../../../helpers/aggregated-emission.helper';
import { IUser } from '../../../../api/models/User/IUser';
import { aggregatedEmissionService } from '../../../services/aggregated-emission.service';
import IAggregatedEmission from '../../../../api/models/DTO/AggregatedEmission/IAggregatedEmission';
import MitigationsForm from './mitigations-form/mitigation-form';
import EmissionsForm from './emissions-form/emissions-form';

interface Props {
    user: IUser | null,
    climateActions: Array<IClimateAction>,
    submitButtonText: string,
    sites: Array<ISite>,
    defaultScope?: ClimateActionScopes,
    defaultType?: ClimateActionTypes,
    addClimateAction: (climateAction: IClimateAction) => void,
    addAggregatedEmission: (aggregatedEmission: IAggregatedEmission) => void,
    onModalHide: () => void
}

const AddClimateActionModal: FunctionComponent<Props> = (props) => {

    const { user, climateActions, sites, defaultScope, defaultType,
        addClimateAction, onModalHide, addAggregatedEmission } = props;

    const [climateActionType, setClimateActionType] = useState<ClimateActionTypes>();
    const [climateActionScope, setClimateActionScope] = useState<ClimateActionScopes>(ClimateActionScopes.Scope1);

    const [typeOptions, setTypeOptions] = useState<DropdownOption[]>([]);
    const [scopeOptions, setScopeOptions] = useState<DropdownOption[]>([]);

    useEffect(() => {

        setTypeOptions([
            { name: ClimateActionTypes[ClimateActionTypes.Emissions], value: ClimateActionTypes[ClimateActionTypes.Emissions] },
            { name: ClimateActionTypes[ClimateActionTypes.Mitigations], value: ClimateActionTypes[ClimateActionTypes.Mitigations] }
        ]);

        setScopeOptions([
            { name: ClimateActionScopes[ClimateActionScopes.Scope1], value: ClimateActionScopes[ClimateActionScopes.Scope1] },
            { name: ClimateActionScopes[ClimateActionScopes.Scope2], value: ClimateActionScopes[ClimateActionScopes.Scope2] },
            { name: ClimateActionScopes[ClimateActionScopes.Scope3], value: ClimateActionScopes[ClimateActionScopes.Scope3] },
        ]);
    }, []);

    useEffect(() => {

        if (defaultType !== undefined)
            setClimateActionType(defaultType);
        if (defaultScope !== undefined)
            setClimateActionScope(defaultScope);

    }, [defaultScope, defaultType]);

    const saveClimateAction = (climateAction?: IClimateAction) => {

        if (!climateAction)
            return;

        if (!user || !user.company || !user.company.id)
            return;

        climateAction.credential_issue_date = Date.now();
        climateAction.organization_name = user.company.organization_name;
        climateAction.signature_name = `${user.firstName} ${user.lastName}`;
        //climateAction.credential_issuer = "OpenClimate";

        const foundSite = sites.find(f => f.facility_name === climateAction.facility_name);
        if (foundSite) {
            climateAction.facility_country = foundSite.facility_country;
            climateAction.facility_jurisdiction = foundSite.facility_jurisdiction;
            climateAction.facility_location = foundSite.facility_location;
            climateAction.facility_sector_ipcc_activity = foundSite.facility_sector_ipcc_activity;
            climateAction.facility_sector_ipcc_category = foundSite.facility_sector_ipcc_category;
            climateAction.facility_sector_naics = foundSite.facility_sector_naics;
            climateAction.facility_type = foundSite.facility_type;
        }

        const userCompanyId = user.company.id;

        const attributes = [
            {
                name: 'credential_category',
                value: 'Mitigations',
            },
            {
                name: 'credential_type',
                value: 'Mitigation Report',
            },
            {
                name: 'climate_action_scope',
                value: '',
            },
            {
                name: 'credential_schema_id',
                value: 'WFZtS6jVBp23b4oDQo6JXP:2:Facility_Scope_1_Mitigations:1.0',
            },
            {
                name: 'credential_issuer',
                value: 'OpenClimate',
            },
            {
                name: 'credential_issue_date',
                value: mitigations.credential_issue_date.toString(),
            },
            {
                name: 'credential_reporting_date_start',
                value: '',
            },
            {
                name: 'credential_reporting_date_end',
                value: '',
            },
            {
                name: 'organization_name',
                value: mitigations.organization_name,
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
                value: mitigations.facility_name,
            },
            {
                name: 'facility_credential_id',
                value: mitigations.facility_country,
            },
            {
                name: 'facility_country',
                value: mitigations.facility_country,
            },
            {
                name: 'facility_jurisdiction',
                value: mitigations.facility_jurisdiction || '',
            },
            {
                name: 'facility_location',
                value: mitigations.facility_location,
            },
            {
                name: 'facility_sector_ipcc_category',
                value: mitigations.facility_sector_ipcc_category || '',
            },
            {
                name: 'facility_sector_ipcc_activity',
                value: mitigations.facility_sector_ipcc_activity || '',
            },
            {
                name: 'facility_sector_naics',
                value: mitigations.facility_sector_naics || '',
            },
            {
                name: 'facility_mitigations_co2e',
                value: mitigations.facility_mitigations_co2e || '',
            },
            {
                name: 'verification_body',
                value: mitigations.verification_body,
            },
            {
                name: 'verification_result',
                value: mitigations.verification_result,
            },
            {
                name: 'verification_credential_id',
                value: mitigations.verification_credential_id,
            },
            {
                name: 'signature_name',
                value: mitigations.signature_name || '',
            }
        ]

        console.log(JSON.stringify(attributes))

        let newCredential = {
            connectionID: props.loggedInUserState.connection_id,
            schemaID: 'WFZtS6jVBp23b4oDQo6JXP:2:Facility_Scope_1_Mitigations:1.0',
            schemaVersion: '1.0',
            schemaName: 'Mitigations',
            schemaIssuerDID: '',
            comment: '',
            attributes: attributes,
        }

        if (props.loggedInUserState.connection_id) {
            props.sendRequest('CREDENTIALS', 'ISSUE_USING_SCHEMA', newCredential)
        }

        climateActionService.saveClimateAction(userCompanyId, climateAction).then(ca => {
            addClimateAction(ca);

            const aggrEmission = AggregatedEmissionHelper.CalculateAggregatedEmission(user, climateActions, ca);
            aggregatedEmissionService.updateAggregatedEmission(userCompanyId, aggrEmission);
            addAggregatedEmission(aggrEmission);

            onModalHide();
            toast("Climate action successfully created");
        });
        return;
    }

    const typeChangedHandler = (name: string, type: string) => {
        const key = type as keyof typeof ClimateActionTypes;
        setClimateActionType(ClimateActionTypes[key]);
    }

    const scopeChangedHandler = (scope: string) => {
        const key = scope as keyof typeof ClimateActionScopes;
        setClimateActionScope(ClimateActionScopes[key]);
    }

    return (

        climateActionType === ClimateActionTypes.Mitigations ?
            <MitigationsForm
                sites={sites}
                defaultScope={climateActionScope}
                onModalHide={onModalHide}
                saveClimateAction={saveClimateAction}
                typeChangedHandler={typeChangedHandler}
                scopeChangedHandler={scopeChangedHandler}
                scopeOptions={scopeOptions}
                typeOptions={typeOptions}
            />
            :
            <EmissionsForm
                sites={sites}
                defaultScope={climateActionScope}
                onModalHide={onModalHide}
                saveClimateAction={saveClimateAction}
                typeChangedHandler={typeChangedHandler}
                scopeChangedHandler={scopeChangedHandler}
                scopeOptions={scopeOptions}
                typeOptions={typeOptions}
            />
    )
}


export default AddClimateActionModal;

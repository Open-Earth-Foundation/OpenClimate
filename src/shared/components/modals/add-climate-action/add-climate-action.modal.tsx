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
    
    useEffect(()=>{

        setTypeOptions([
            {name: ClimateActionTypes[ClimateActionTypes.Emissions], value: ClimateActionTypes[ClimateActionTypes.Emissions]},
            {name: ClimateActionTypes[ClimateActionTypes.Mitigations], value: ClimateActionTypes[ClimateActionTypes.Mitigations]}
        ]);

        setScopeOptions([
            {name: ClimateActionScopes[ClimateActionScopes.Scope1], value: ClimateActionScopes[ClimateActionScopes.Scope1]},
            {name: ClimateActionScopes[ClimateActionScopes.Scope2], value: ClimateActionScopes[ClimateActionScopes.Scope2]},
            {name: ClimateActionScopes[ClimateActionScopes.Scope3], value: ClimateActionScopes[ClimateActionScopes.Scope3]},
        ]);
    },[]);

    useEffect(() => {

        if(defaultType !== undefined)
            setClimateActionType(defaultType);
        if(defaultScope !== undefined)
            setClimateActionScope(defaultScope);

    }, [defaultScope, defaultType]);

    const saveClimateAction = (climateAction?: IClimateAction) => {      

        if(!climateAction)
            return;

        if(!user || !user.company || !user.company.organization_id)
            return;

        climateAction.credential_issue_date = Date.now();
        climateAction.credential_category = "Climate Action";
        climateAction.credential_issuer = "OpenClimate";
        climateAction.organization_name = user.company.name;
        climateAction.signature_name = `${user.email}`;

        const foundSite=  sites.find(f => f.facility_name === climateAction.facility_name);
        if (foundSite) {
            climateAction.facility_country = foundSite.facility_country;
            climateAction.facility_jurisdiction = foundSite.facility_jurisdiction;
            climateAction.facility_location = foundSite.facility_location;
            climateAction.facility_sector_ipcc_activity = foundSite.facility_sector_ipcc_activity;
            climateAction.facility_sector_ipcc_category = foundSite.facility_sector_ipcc_category;
            climateAction.facility_sector_naics = foundSite.facility_sector_naics;
            climateAction.facility_type = foundSite.facility_type;
        }

        const userCompanyId = user.company.organization_id;

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

    const typeChangedHandler = (name: string, type: string) => 
    {
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
            user={user}
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
            user={user}
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

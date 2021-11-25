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

        console.log(climateAction)
        console.log(climateAction.climate_action_type)
        console.log(climateAction.climate_action_scope)

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

        const credential_issue_date = Date.now()

        if (climateAction.climate_action_type && climateAction.climate_action_type === 'Emissions') {
          const attributes_1 = [
            {
                name: 'credential_category',
                value: climateAction.credential_category || '',
            },
            {
                name: 'credential_type',
                value: climateAction.climate_action_type || '',
            },
            {
                name: 'climate_action_scope',
                value: climateAction.climate_action_scope || '',
            },
            {
                name: 'credential_issuer',
                value: 'OpenClimate',
            },
            {
                name: 'credential_issue_date',
                value: credential_issue_date.toString(),
            },
            {
                name: 'credential_reporting_date_start',
                value: climateAction.credential_reporting_date_start.toString()
            },
            {
                name: 'credential_reporting_date_end',
                value: climateAction.credential_reporting_date_end.toString()
            },
            {
                name: 'organization_name',
                value: climateAction.organization_name || '',
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
                value: climateAction.facility_name,
            },
            {
                name: 'facility_credential_id',
                value: climateAction.facility_country,
            },
            {
                name: 'facility_country',
                value: climateAction.facility_country,
            },
            {
                name: 'facility_jurisdiction',
                value: climateAction.facility_jurisdiction || '',
            },
            {
                name: 'facility_location',
                value: climateAction.facility_location,
            },
            {
                name: 'facility_sector_ipcc_category',
                value: climateAction.facility_sector_ipcc_category || '',
            },
            {
                name: 'facility_sector_ipcc_activity',
                value: climateAction.facility_sector_ipcc_activity || '',
            },
            {
                name: 'facility_sector_naics',
                value: climateAction.facility_sector_naics || '',
            },
          ]

          if (climateAction.climate_action_scope && climateAction.climate_action_scope === 'Scope1') {
            const attributes_2 = [
              {
                  name: 'credential_name',
                  value: 'Facility_Scope_1'
              },
              {
                  name: 'credential_schema_id',
                  value: 'WFZtS6jVBp23b4oDQo6JXP:2:Facility_Scope_1:1.0',
              },
              {
                  name: 'facility_emissions_scope1_co2e',
                  value: climateAction.facility_emissions_co2e || '',
              },
              {
                  name: 'facility_emissions_scope1_co2_fossil',
                  value: climateAction.facility_emissions_co2_fossil || '',
              },
              {
                  name: 'facility_emissions_scope1_co2_biomass',
                  value: climateAction.facility_emissions_co2_biomass || '',
              },
              {
                  name: 'facility_emissions_scope1_ch4',
                  value: climateAction.facility_emissions_ch4 || '',
              },
              {
                  name: 'facility_emissions_scope1_n2o',
                  value: climateAction.facility_emissions_n2o || '',
              },
              {
                  name: 'facility_emissions_scope1_hfc',
                  value: climateAction.facility_emissions_hfc || '',
              },
              {
                  name: 'facility_emissions_scope1_pfc',
                  value: climateAction.facility_emissions_pfc || '',
              },
              {
                  name: 'facility_emissions_scope1_sf6',
                  value: climateAction.facility_emissions_sf6 || '',
              },
              {
                  name: 'facility_emissions_scope1_combustion_co2e',
                  value: climateAction.facility_emissions_combustion_co2e || '',
              },
              {
                  name: 'facility_emissions_scope1_combustion_co2_fossil',
                  value: climateAction.facility_emissions_combustion_co2_fossil || '',
              },
              {
                  name: 'facility_emissions_scope1_combustion_co2_biomass',
                  value: climateAction.facility_emissions_combustion_co2_biomass || '',
              },
              {
                  name: 'facility_emissions_scope1_combustion_ch4',
                  value: climateAction.facility_emissions_combustion_ch4 || '',
              },
              {
                  name: 'facility_emissions_scope1_combustion_n2o',
                  value: climateAction.facility_emissions_combustion_n2o || '',
              },
              {
                  name: 'facility_emissions_scope1_fvpwt_co2e',
                  value: climateAction.facility_emissions_fvpwt_co2e || '',
              },
              {
                  name: 'facility_emissions_scope1_fvpwt_co2_fossil',
                  value: climateAction.facility_emissions_fvpwt_co2_fossil || '',
              },
              {
                  name: 'facility_emissions_scope1_fvpwt_co2_biomass',
                  value: climateAction.facility_emissions_fvpwt_co2_biomass || '',
              },
              {
                  name: 'facility_emissions_scope1_fvpwt_ch4',
                  value: climateAction.facility_emissions_fvpwt_ch4 || '',
              },
              {
                  name: 'facility_emissions_scope1_fvpwt_n2o',
                  value: climateAction.facility_emissions_fvpwt_n2o || '',
              },
              {
                  name: 'facility_emissions_scope1_fvpwt_hfc',
                  value: climateAction.facility_emissions_fvpwt_hfc || '',
              },
              {
                  name: 'facility_emissions_scope1_fvpwt_pfc',
                  value: climateAction.facility_emissions_fvpwt_pfc || '',
              },
              {
                  name: 'facility_emissions_scope1_fvpwt_sf6',
                  value: climateAction.facility_emissions_fvpwt_sf6 || '',
              },
              {
                  name: 'verification_body',
                  value: climateAction.verification_body || ''
              },
              {
                  name: 'verification_result',
                  value: climateAction.verification_result || ''
              },
              {
                  name: 'verification_credential_id',
                  value: climateAction.verification_credential_id || ''
              },
              {
                  name: 'signature_name',
                  value: climateAction.signature_name || '',
              }
            ]
            console.log(attributes_1)
            console.log(attributes_2)
            const attributes = attributes_1.concat(attributes_2)
            console.log(attributes)
            let newCredential = {
                connectionID: props.loggedInUserState.connection_id,
                schemaID: 'WFZtS6jVBp23b4oDQo6JXP:2:Facility_Scope_1:1.0',
                schemaVersion: '1.0',
                schemaName: 'Facility_Scope_1',
                schemaIssuerDID: 'WFZtS6jVBp23b4oDQo6JXP',
                comment: 'Facility_Scope_1',
                attributes: attributes,
            }
            console.log(newCredential)

            if (props.loggedInUserState.connection_id) {
                props.sendRequest('CREDENTIALS', 'ISSUE_USING_SCHEMA', newCredential)
            }
          } else if (climateAction.climate_action_scope && climateAction.climate_action_scope === 'Scope2') {
            const attributes_2 = [
              {
                  name: 'credential_name',
                  value: 'Facility_Scope_2'
              },
              {
                  name: 'credential_schema_id',
                  value: 'WFZtS6jVBp23b4oDQo6JXP:2:Facility_Scope_2:1.0',
              },
              {
                  name: 'facility_energy_grid_operator_name',
                  value: climateAction.facility_energy_grid_operator_name || '',
              },
              {
                  name: 'facility_energy_consumption',
                  value: climateAction.facility_energy_consumption || '',
              },
              {
                  name: 'facility_emissions_scope2_co2e',
                  value: climateAction.facility_emissions_co2e || '',
              },
              {
                  name: 'facility_emissions_scope2_market_based_co2e',
                  value: climateAction.facility_emissions_market_based_co2e || '',
              },
              {
                  name: 'facility_emissions_scope2_location_based_co2e',
                  value: climateAction.facility_emissions_location_based_co2e || '',
              },
              {
                  name: 'facility_energy_grid_operator_co2_rate',
                  value: climateAction.facility_energy_grid_operator_co2_rate || '',
              },
              {
                  name: 'facility_energy_grid_operator_ch4_rate',
                  value: climateAction.facility_energy_grid_operator_ch4_rate || '',
              },
              {
                  name: 'facility_energy_grid_operator_n2o_rate',
                  value: climateAction.facility_energy_grid_operator_n2o_rate || '',
              },
              {
                  name: 'facility_emissions_scope2_location_based_co2',
                  value: climateAction.facility_emissions_location_based_co2 || '',
              },
              {
                  name: 'facility_emissions_scope2_location_based_ch4',
                  value: climateAction.facility_emissions_location_based_ch4 || '',
              },
              {
                  name: 'facility_emissions_scope2_location_based_n2o',
                  value: climateAction.facility_emissions_location_based_n2o || '',
              },
              {
                  name: 'verification_body',
                  value: climateAction.verification_body || ''
              },
              {
                  name: 'verification_result',
                  value: climateAction.verification_result || ''
              },
              {
                  name: 'verification_credential_id',
                  value: climateAction.verification_credential_id || ''
              },
              {
                  name: 'signature_name',
                  value: climateAction.signature_name || '',
              }
            ]

            const attributes = attributes_1.concat(attributes_2)

            let newCredential = {
                connectionID: props.loggedInUserState.connection_id,
                schemaID: 'WFZtS6jVBp23b4oDQo6JXP:2:Facility_Scope_2:1.0',
                schemaVersion: '1.0',
                schemaName: 'Facility_Scope_2',
                schemaIssuerDID: 'WFZtS6jVBp23b4oDQo6JXP',
                comment: 'Facility_Scope_2',
                attributes: attributes,
            }

            if (props.loggedInUserState.connection_id) {
                props.sendRequest('CREDENTIALS', 'ISSUE_USING_SCHEMA', newCredential)
            }
          } else if (climateAction.climate_action_scope && climateAction.climate_action_scope === 'Scope3') {
            const attributes_2 = [
              {
                  name: 'credential_name',
                  value: 'Facility_Scope_3'
              },
              {
                  name: 'credential_schema_id',
                  value: 'WFZtS6jVBp23b4oDQo6JXP:2:Facility_Scope_3:1.0',
              },
              {
                  name: 'facility_emissions_scope3_co2e',
                  value: climateAction.facility_emissions_scope3_co2e || '',
              },
              {
                  name: 'verification_body',
                  value: climateAction.verification_body || ''
              },
              {
                  name: 'verification_result',
                  value: climateAction.verification_result || ''
              },
              {
                  name: 'verification_credential_id',
                  value: climateAction.verification_credential_id || ''
              },
              {
                  name: 'signature_name',
                  value: climateAction.signature_name || '',
              }
            ]

            const attributes = attributes_1.concat(attributes_2)

            let newCredential = {
                connectionID: props.loggedInUserState.connection_id,
                schemaID: 'WFZtS6jVBp23b4oDQo6JXP:2:Facility_Scope_3:1.0',
                schemaVersion: '1.0',
                schemaName: 'Facility_Scope_3',
                schemaIssuerDID: 'WFZtS6jVBp23b4oDQo6JXP',
                comment: 'Facility_Scope_3',
                attributes: attributes,
            }

            if (props.loggedInUserState.connection_id) {
                props.sendRequest('CREDENTIALS', 'ISSUE_USING_SCHEMA', newCredential)
            }
          }
        } else if (climateAction.climate_action_type && climateAction.climate_action_type === 'Mitigations') {
          const attributes = [
            {
                name: 'credential_category',
                value: climateAction.credential_category || '',
            },
            {
                name: 'credential_type',
                value: climateAction.climate_action_type || '',
            },
            {
                name: 'credential_name',
                value: 'Facility_Scope_1_Mitigations'
            },
            {
                name: 'climate_action_scope',
                value: climateAction.climate_action_scope
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
                value: credential_issue_date.toString(),
            },
            {
                name: 'credential_reporting_date_start',
                value: climateAction.credential_reporting_date_start.toString()
            },
            {
                name: 'credential_reporting_date_end',
                value: climateAction.credential_reporting_date_end.toString()
            },
            {
                name: 'organization_name',
                value: climateAction.organization_name || '',
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
                value: climateAction.facility_name,
            },
            {
                name: 'facility_credential_id',
                value: climateAction.facility_country,
            },
            {
                name: 'facility_country',
                value: climateAction.facility_country,
            },
            {
                name: 'facility_jurisdiction',
                value: climateAction.facility_jurisdiction || '',
            },
            {
                name: 'facility_location',
                value: climateAction.facility_location,
            },
            {
                name: 'facility_sector_ipcc_category',
                value: climateAction.facility_sector_ipcc_category || '',
            },
            {
                name: 'facility_sector_ipcc_activity',
                value: climateAction.facility_sector_ipcc_activity || '',
            },
            {
                name: 'facility_sector_naics',
                value: climateAction.facility_sector_naics || '',
            },
            {
                name: 'facility_mitigations_scope1_co2e',
                value: climateAction.facility_mitigations_co2e || '',
            },
            {
                name: 'verification_body',
                value: climateAction.verification_body || ''
            },
            {
                name: 'verification_result',
                value: climateAction.verification_result || ''
            },
            {
                name: 'verification_credential_id',
                value: climateAction.verification_credential_id || ''
            },
            {
                name: 'signature_name',
                value: climateAction.signature_name || '',
            }
          ]

          let newCredential = {
              connectionID: props.loggedInUserState.connection_id,
              schemaID: 'WFZtS6jVBp23b4oDQo6JXP:2:Facility_Scope_1_Mitigations:1.0',
              schemaVersion: '1.0',
              schemaName: 'Facility_Scope_1_Mitigations',
              schemaIssuerDID: 'WFZtS6jVBp23b4oDQo6JXP',
              comment: 'Facility_Scope_1_Mitigations',
              attributes: attributes,
          }

          if (props.loggedInUserState.connection_id) {
              props.sendRequest('CREDENTIALS', 'ISSUE_USING_SCHEMA', newCredential)
          }
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
                sendRequest={props.sendRequest}
                loggedInUserState={props.loggedInUserState}
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
                sendRequest={props.sendRequest}
                loggedInUserState={props.loggedInUserState}
            />
    )
}


export default AddClimateActionModal;

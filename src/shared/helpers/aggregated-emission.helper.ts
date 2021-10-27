import IAggregatedEmission from "../../api/models/DTO/AggregatedEmission/IAggregatedEmission";
import { ClimateActionScopes } from "../../api/models/DTO/ClimateAction/climate-action-scopes";
import { ClimateActionTypes } from "../../api/models/DTO/ClimateAction/climate-action-types";
import IClimateAction from "../../api/models/DTO/ClimateAction/IClimateAction";
import { IUser } from "../../api/models/User/IUser";

const CalculateAggregatedEmission = (cUser: IUser | null, climateActions: Array<IClimateAction>, newClimateAction: IClimateAction ) => {
    const aggEmission: IAggregatedEmission = {
        credential_category: 'Climate Action',
        credential_type: 'Aggregated',
        credential_name: 'Aggregated Facility GHG Report (Scope 1, 2 & 3)',
        climate_action_scope: ClimateActionScopes.Aggregated,
        credential_schema_id: '4d385596-04fc-4dd8-b8ae-ddd1b79d6742', //todo
        credential_issuer: 'OpenClimate',
        credential_issue_date: new Date(),//?
        //credential_reporting_date_start:,
        //credential_reporting_date_end:
        organization_name: cUser?.company?.name,
        //organization_category,
        //organization_type,
        //organization_credential_id:4d385596-04fc-4dd8-b8ae-ddd1b79d6742,
        facility_name: newClimateAction.facility_name,
        //facility_credential_id ,
        facility_country: newClimateAction.facility_country,
        facility_jurisdiction: newClimateAction.facility_jurisdiction,
        facility_location: newClimateAction.facility_location,
        facility_sector_ipcc_category: newClimateAction.facility_sector_ipcc_category,
        facility_sector_ipcc_activity: newClimateAction.facility_sector_ipcc_activity,
        facility_sector_naics: newClimateAction.facility_sector_naics,
        facility_ghg_scope1_credential_id: [],
        facility_ghg_scope2_credential_id: [],
        facility_ghg_scope3_credential_id: []
    }

    const actionsByFacility = climateActions.filter(a => a.facility_name === newClimateAction.facility_name); //facility_credential_id
    actionsByFacility.push(newClimateAction);

    const emissionsByFacility = actionsByFacility.filter(a => a.climate_action_type?.toString()  == ClimateActionTypes[ClimateActionTypes.Emissions]);
    const mitigationsByFacility = actionsByFacility.filter(a =>  a.climate_action_type?.toString() == ClimateActionTypes[ClimateActionTypes.Mitigations]);
    
    let scope1Ids: Array<string> = [], scope2Ids: Array<string> = [], scope3Ids: Array<string> = [];
    let grossTotal = 0, sinksTotal = 0;

    actionsByFacility.map(a => {
        switch(a.climate_action_scope?.toString())
        {
            case ClimateActionScopes[ClimateActionScopes.Scope1]:
                scope1Ids.push(a.verification_credential_id ?? '');
                break;
            case ClimateActionScopes[ClimateActionScopes.Scope2]:
                scope2Ids.push(a.verification_credential_id ?? '');
                break;
            case ClimateActionScopes[ClimateActionScopes.Scope3]:
                scope3Ids.push(a.verification_credential_id ?? '');
                break;
        }
    });

    emissionsByFacility.map(e => grossTotal += e.facility_emissions_co2e ? +e.facility_emissions_co2e : 0);
    mitigationsByFacility.map(e => sinksTotal += e.facility_mitigations_co2e ? +e.facility_mitigations_co2e : 0);

    aggEmission.facility_ghg_total_net_co2e = grossTotal - sinksTotal;
    aggEmission.facility_ghg_total_gross_co2e = grossTotal;
    aggEmission.facility_ghg_total_sinks_co2e = sinksTotal;
    aggEmission.facility_ghg_scope1_credential_id = scope1Ids;
    aggEmission.facility_ghg_scope2_credential_id = scope2Ids;
    aggEmission.facility_ghg_scope3_credential_id = scope3Ids;

    //organization_ghg_scope1_co2e ??

    aggEmission.signature_name = `${cUser?.firstName} ${cUser?.lastName} `;

    const actionsDirect = actionsByFacility.filter(a => a.verification_credential_id);
    const acitonsIndirect = actionsByFacility.filter(a => a.verification_body && !a.verification_credential_id);
    const actionsNoTracking = actionsByFacility.filter(a => !a.verification_body && !a.verification_credential_id);
    
    aggEmission.verification_accountability_direct = actionsDirect.length / actionsByFacility.length * 100;
    aggEmission.verification_accountability_indirect = acitonsIndirect.length / actionsByFacility.length * 100;
    aggEmission.verification_accountability_no_tracking = actionsNoTracking.length / actionsByFacility.length * 100;

    return aggEmission;
}

const GetSummaryAggregatedEmissions = (aggregatedEmissions: Array<IAggregatedEmission>) => {
    
    const gross = aggregatedEmissions.reduce((a: number, n: IAggregatedEmission) => {
        return a += n.facility_ghg_total_gross_co2e ? Number(n.facility_ghg_total_gross_co2e) : 0;
    }, 0);

    const net = aggregatedEmissions.reduce((a: number, n: IAggregatedEmission) => {
        return a += n.facility_ghg_total_net_co2e ? Number(n.facility_ghg_total_net_co2e) : 0;
    }, 0);

    const trackedSum = aggregatedEmissions.reduce((a: number, n: IAggregatedEmission) => {
        return a += n.verification_accountability_direct ? Number(n.verification_accountability_direct) : 0;
    }, 0);

    const indirectSum = aggregatedEmissions.reduce((a: number, n: IAggregatedEmission) => {
        return a += n.verification_accountability_indirect ? Number(n.verification_accountability_indirect) : 0;
    }, 0);

    const untrackedSum = aggregatedEmissions.reduce((a: number, n: IAggregatedEmission) => {
        return a += n.verification_accountability_no_tracking ? Number(n.verification_accountability_no_tracking) : 0;
    }, 0);

    const summaryAggr: IAggregatedEmission = {
        credential_category: 'Climate Action',
        facility_ghg_total_gross_co2e: gross,
        facility_ghg_total_net_co2e: net,
        facility_ghg_total_sinks_co2e: gross-net,
        verification_accountability_direct: trackedSum ? trackedSum/ aggregatedEmissions.length : 0,
        verification_accountability_indirect: indirectSum ? indirectSum / aggregatedEmissions.length : 0,
        verification_accountability_no_tracking: untrackedSum ? untrackedSum / aggregatedEmissions.length : 0
    }

    return summaryAggr;
}

export const AggregatedEmissionHelper = {
    CalculateAggregatedEmission,
    GetSummaryAggregatedEmissions
};
import { EmissionInfo } from "../../../../components/review/review.page";
import { ClimateActionScopes } from "../ClimateAction/climate-action-scopes";

export default interface IAggregatedEmission {
    id?: string,
    credential_category?: string,
    credential_type?: string,
    credential_name?: string,
    climate_action_scope?: ClimateActionScopes,
    credential_schema_id?: string,
    credential_issuer?: string,
    credential_issue_date?: Date,
    organization_name?: string,
    organization_category?: string, 
    organization_type?: string, 
    organization_credential_id?: string,
    facility_name?: string,
    facility_credential_id?: string,
    facility_country?: string,
    facility_jurisdiction?: string,
    facility_location?: string,
    facility_sector_ipcc_category?: string, 
    facility_sector_ipcc_activity?: string,
    facility_sector_naics?: string,
    facility_ghg_total_net_co2e?: number,
    facility_ghg_total_gross_co2e?: number,
    facility_ghg_year?: number,
    facility_ghg_methodologies?: Array<object>
    facility_ghg_date_updated?: string
    facility_ghg_scope1_co2e?: number,
    facility_ghg_scope1_credential_id?: Array<string>,
    facility_ghg_scope2_co2e?: number,
    facility_ghg_scope2_credential_id?: Array<string>,
    facility_ghg_scope3_co2e?: number,
    facility_ghg_scope3_credential_id?: Array<string>,
    facility_ghg_total_sinks_co2e?: number,
    verification_accountability_direct?: number,
    verification_accountability_indirect?: number,
    verification_accountability_no_tracking?: number,
    signature_name?: string,
    providerToEmissions?: Record<string, EmissionInfo>
}
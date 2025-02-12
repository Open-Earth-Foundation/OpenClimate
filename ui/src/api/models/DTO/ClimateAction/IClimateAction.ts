import { ClimateActionScopes } from "./climate-action-scopes";
import { ClimateActionTypes } from "./climate-action-types";

export default interface IClimateAction {
  id?: string;
  credential_category?: string;
  climate_action_type?: ClimateActionTypes;
  climate_action_scope?: ClimateActionScopes;
  credential_type?: string;
  credential_schema_id?: string;
  credential_issuer?: string;
  credential_issue_date?: number;
  credential_reporting_date_start?: Date;
  credential_reporting_date_end?: Date;
  organization_name?: string;
  organization_category?: string;
  organization_type?: string;
  organization_credential_id?: string;
  facility_name?: string;
  facility_credential_id?: string;
  facility_country?: string;
  facility_jurisdiction?: string;
  facility_location?: string;
  facility_sector_ipcc_category?: string;
  facility_sector_ipcc_activity?: string;
  facility_sector_naics?: string;
  facility_emissions_co2e?: number;
  facility_emissions_co2_fossil?: number;
  facility_emissions_co2_biomass?: number;
  facility_emissions_ch4?: number;
  facility_emissions_n2o?: number;
  facility_emissions_hfc?: number;
  facility_emissions_pfc?: number;
  facility_emissions_sf6?: number;
  facility_emissions_combustion_co2e?: number;
  facility_emissions_combustion_co2_fossil?: number;
  facility_emissions_combustion_co2_biomass?: number;
  facility_emissions_combustion_ch4?: number;
  facility_emissions_combustion_n2o?: number;
  facility_emissions_fvpwt_co2e?: number;
  facility_emissions_fvpwt_co2_fossil?: number;
  facility_emissions_fvpwt_co2_biomass?: number;
  facility_emissions_fvpwt_ch4?: number;
  facility_emissions_fvpwt_n2o?: number;
  facility_emissions_fvpwt_hfc?: number;
  facility_emissions_fvpwt_pfc?: number;
  facility_emissions_fvpwt_sf6?: number;
  facility_mitigations_co2e?: number;
  facility_type?: string;
  verification_body?: string;
  verification_result?: string;
  verification_credential_id?: string;
  signature_name?: string;
}

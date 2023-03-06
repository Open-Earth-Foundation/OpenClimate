export default interface IClimateAction {
  id?: string;
  credential_category?: string;
  credential_type?: string;
  climate_action_scope?: string;
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
  facility_type?: string;
  verification_body?: string;
  verification_result?: string;
  verification_credential_id?: string;
  signature_name?: string;
}

export default interface ISite {
  id?: string;
  credential_category?: string;
  credential_type?: string;
  credential_schema_id?: string;
  credential_issuer?: string;
  credential_issue_date?: number;

  organization_id?: string;
  organization_name?: string;
  organization_category?: string;
  organization_type?: string;
  organization_credential_id?: string;

  facility_name?: string;
  facility_country?: string;
  facility_jurisdiction?: string;
  facility_location?: string;
  facility_sector_ipcc_category?: string;
  facility_sector_ipcc_activity?: string;
  facility_sector_naics?: string;
  facility_type?: string;
  facility_bounds?: string;
  signature_name?: string;
}

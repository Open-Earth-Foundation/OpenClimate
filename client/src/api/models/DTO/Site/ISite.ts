export default interface ISite {
    credential_category: string,
    credential_type?: string,
    credential_schema_id?: string,
    credential_issuer?: string,
    credential_issue_date?: number,

    organization_name?: string,
    organization_category?: string,
    organization_type?: string,
    organization_credential_id?: string,

    facility_name?: string,
    //facility_jurisdiction?: number,
    facility_country?: string,
    facility_subnational?: string,
    facility_location?: string,
    facility_sector_ipcc_category?: string,
    facility_sector_ipcc_activity?: string,
    facility_sector_naics?: string,
    signature_name?: string
}
export default interface IPledge {
    id?: string,
    source?: string;
    credential_category?: string,
    credential_type?: string,
    credential_schema_id?: string,
    credential_issuer?: string,
    credential_issue_date?: number,
    organization_name?: string,
    organization_category?: string,
    organization_type?: string,
    organization_credential_id?: string,
    pledge_target_year?: number,
    pledge_emission_target?: number,
    pledge_emission_reduction?: number,
    pledge_carbon_intensity_target?: number,
    pledge_carbon_intensity_reduction?:number,
    pledge_base_year?: number,
    pledge_base_level?: number,
    pledge_plan_details?: string,
    pledge_public_statement?: string,
    signature_name?: string
}
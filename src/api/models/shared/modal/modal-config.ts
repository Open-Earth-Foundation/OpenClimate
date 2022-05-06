export default interface ModalConfig {
    entityType: '' | 'login' | 'login-credential' | 'registration' | 'verify-information' | 'report-credential' 
    | 'demo-info' | 'emission-filters' | 'add-pledge' | 'add-site-credential' | 'add-transfer' | 'add-climate-action'
    | 'information-agreements' | 'information-pledges' | 'information-emission' | 'information-transfers' 
    | 'information-climate-units' | 'information-summary'| 'add-ghg-cred'| 'send-ghg-proof' | 'accept-ghg-proof',
    parameters?: any
}

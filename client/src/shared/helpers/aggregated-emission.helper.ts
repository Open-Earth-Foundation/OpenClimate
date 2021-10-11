import IAggregatedEmission from "../../api/models/DTO/AggregatedEmission/IAggregatedEmission";
import { ClimateActionScopes } from "../../api/models/DTO/ClimateAction/climate-action-scopes";
import IClimateAction from "../../api/models/DTO/ClimateAction/IClimateAction";

const UpdateAggregatedEmission = (climateActions: Array<IClimateAction>) => {
    
    const aggEmission: IAggregatedEmission = {
        credential_category: 'Climate Action',
        credential_type: 'Aggregated',
        credential_name: 'Aggregated Facility GHG Report (Scope 1, 2 & 3)',
        climate_action_scope: ClimateActionScopes.Aggregated,
        credential_schema_id: '4d385596-04fc-4dd8-b8ae-ddd1b79d6742', //todo
        credential_issuer: 'OpenClimate',
        credential_issue_date: new Date(),//?
        


    }


}


export const ClimateActionHelper = {
    UpdateAggregatedEmission
};
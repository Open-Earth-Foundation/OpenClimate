import { ClimateActionScopes } from "../../api/models/DTO/ClimateAction/climate-action-scopes";
import { ClimateActionTypes } from "../../api/models/DTO/ClimateAction/climate-action-types";
import IClimateAction from "../../api/models/DTO/ClimateAction/IClimateActions/IClimateAction";

const GetClimateActions = (climateActions: Array<IClimateAction>, scope: ClimateActionScopes, type: ClimateActionTypes) => {
    const scopeStr = ClimateActionScopes[scope];
    const typeStr = ClimateActionTypes[type];

    return climateActions.filter(act => act.climate_action_scope?.toString() == scopeStr 
            && act.climate_action_type?.toString() == typeStr);
}

const GetTotalC02 = (climateActions: Array<IClimateAction>, type: ClimateActionTypes) => 
{
    const act1 = GetClimateActions(climateActions, ClimateActionScopes.Scope1, type);
    const act2 = GetClimateActions(climateActions, ClimateActionScopes.Scope2, type);
    const act3 = GetClimateActions(climateActions, ClimateActionScopes.Scope3, type);

    const sumAct1 = GetSumC02(act1, 'facility_emissions_scope1_co2e');
    const sumAct2 = GetSumC02(act2, 'facility_emissions_scope2_co2e');
    const sumAct3 = GetSumC02(act3, 'facility_emissions_scope3_co2e');
    
    const sum = sumAct1 + sumAct2 + sumAct3;

    return isNaN(sum) ? 0 : sum;
}

const GetSumC02 = (climateActions: Array<IClimateAction>, prop: string) => {
    const sum = climateActions.reduce( function(a, b) {
        return a + Number((b as any)[prop]);
    }, 0);
    
    return isNaN(sum) ? 0 : sum;
}

const GetPropByScope = (scope: ClimateActionScopes) => {

    let prop = '';
    
    switch(scope)
    {
        case ClimateActionScopes.Scope1:
            prop = 'facility_emissions_scope1_co2e';
            break;
        case ClimateActionScopes.Scope2:
            prop = 'facility_emissions_scope2_co2e';
            break;
        case ClimateActionScopes.Scope3:
            prop = 'facility_emissions_scope3_co2e';
            break;
    }

    return prop;
    //return GetSumC02(climateActions, prop);
}
/*
function ChangedAllScopesProp(obj: any, scope: ClimateActionScopes)
{
    return Object.keys(obj).filter(k => k.includes('_scope_')).map(p => ChangeScopeProp(obj, p, scope));
}

function ChangeScopeProp(obj: any, propName: string,  scope: ClimateActionScopes) {
    const newPropName = propName.replace('_scope_', `_${scope.toString().toLowerCase()}_`);

    obj[newPropName] = obj[propName];
    delete obj[propName];
} 
*/
export const ClimateActionHelper = {
    GetClimateActions,
    GetTotalC02,
    GetSumC02,
    GetPropByScope,
    //ChangedAllScopesProp
};
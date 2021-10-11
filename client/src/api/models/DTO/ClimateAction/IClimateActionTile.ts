import { ClimateActionScopes } from "./climate-action-scopes";
import { ClimateActionTypes } from "./climate-action-types";
import IClimateAction from "./IClimateAction";

export default interface ClimateActionTile {
    scope: ClimateActionScopes,
    type: ClimateActionTypes, 
    total: number,
    climateActions: Array<IClimateAction>
}
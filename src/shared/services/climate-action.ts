import IClimateAction from "../../api/models/DTO/ClimateAction/IClimateActions/IClimateAction";
import { ServerUrls } from "../environments/server.environments";
import { CommonHelper } from "../helpers/common.helper";

function saveClimateAction(orgId: string, climateAction: IClimateAction)
{
    return fetch(`${ServerUrls.api}/${orgId}/climate-action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(climateAction),
    }).then(CommonHelper.HandleResponse);
}

function allClimateAction(orgId: string)
{
    return fetch(`${ServerUrls.api}/${orgId}/climate-action/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }).then(CommonHelper.HandleResponse).then((actions: Array<IClimateAction>) => actions);
}

export const climateActionService = {
    saveClimateAction,
    allClimateAction
};

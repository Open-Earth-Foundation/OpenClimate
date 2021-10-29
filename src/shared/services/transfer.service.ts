import ITransfer from "../../api/models/DTO/Transfer/ITransfer";
import { ServerUrls } from "../environments/server.environments";
import { CommonHelper } from "../helpers/common.helper";

function saveTransfer(orgId: string, transfer: any)
{
    return fetch(`${ServerUrls.api}/${orgId}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transfer),
    }).then(CommonHelper.HandleResponse);
}

function allTransfers(orgId: string)
{
    return fetch(`${ServerUrls.api}/${orgId}/transfer/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }).then(CommonHelper.HandleResponse).then((transfers:Array<ITransfer>) => transfers);
}

export const transferService = {
    saveTransfer,
    allTransfers
};
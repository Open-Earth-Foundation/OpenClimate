import IOrganization from "../../api/models/DTO/Organization/IOrganization";
import { ServerUrls } from "../environments/server.environments";
import { CommonHelper } from "../helpers/common.helper";

async function getByCredentialId(credentialId: string)
{
    return fetch(`${ServerUrls.api}/organization/${credentialId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }).then(CommonHelper.HandleResponse).then((organization: IOrganization) => organization);
}

async function saveOrganization(orgData: IOrganization)
{
    return fetch(`${ServerUrls.api}/organization`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orgData),
    }).then(CommonHelper.HandleResponse);
}

export const organizationService = {
    getByCredentialId,
    saveOrganization
};
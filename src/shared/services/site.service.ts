import ISite from "../../api/models/DTO/Site/ISite";
import { ServerUrls } from "../environments/server.environments";
import { CommonHelper } from "../helpers/common.helper";

function saveSite(orgId: string, site: ISite)
{
    return fetch(`${ServerUrls.api}/${orgId}/site`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(site),
    }).then(CommonHelper.HandleResponse);
}

function allSites(orgId: string)
{
    return fetch(`${ServerUrls.api}/${orgId}/site/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }).then(CommonHelper.HandleResponse).then((sites: Array<ISite>) => sites);
}

export const siteService = {
    saveSite,
    allSites
};

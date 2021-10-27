import ISite from "../../api/models/DTO/Site/ISite";
import { ServerUrls } from "../environments/server.environments";
import { CommonHelper } from "../helpers/common.helper";

function saveSite(site: ISite)
{
    return fetch(`${ServerUrls.api}/site`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(site),
    }).then(CommonHelper.HandleResponse);
}

function allSites()
{
    return fetch(`${ServerUrls.api}/site/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }).then(CommonHelper.HandleResponse).then((sites: Array<ISite>) => sites);
}

export const siteService = {
    saveSite,
    allSites
};

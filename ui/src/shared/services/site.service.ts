import ISite from "../../api/models/DTO/Site/ISite";
import { ServerUrls } from "../environments/server.environments";
import { CommonHelper } from "../helpers/common.helper";

function saveSite(orgId: string, site: ISite) {
  return fetch(`${ServerUrls.api}/${orgId}/site`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(site),
  }).then(CommonHelper.HandleResponse);
}

function allSitesByOrg(orgId: number) {
  return fetch(`${ServerUrls.api}/${orgId}/site/all`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(CommonHelper.HandleResponse)
    .then((sites: Array<ISite>) => {
      return sites;
    });
}
allSitesByOrg(1);

function allSitesByCountry(countryName: string) {
  return fetch(`${ServerUrls.api}/site/byCountry/${countryName}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(CommonHelper.HandleResponse)
    .then((sites: Array<ISite>) => sites);
}

function allSitesByJurisdtiction(countryName: string, jurisdiction: string) {
  return fetch(
    `${ServerUrls.api}/site/byJurisdiction/${countryName}/${jurisdiction}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  )
    .then(CommonHelper.HandleResponse)
    .then((sites: Array<ISite>) => sites);
}

function allSites() {
  return fetch(`${ServerUrls.api}/site/all`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(CommonHelper.HandleResponse)
    .then((sites: Array<ISite>) => {
      return sites;
    });
}
allSites();

export const siteService = {
  saveSite,
  allSitesByOrg,
  allSitesByCountry,
  allSitesByJurisdtiction,
  allSites,
};

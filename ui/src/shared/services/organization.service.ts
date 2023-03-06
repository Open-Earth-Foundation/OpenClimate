import IOrganization from "../../api/models/DTO/Organization/IOrganization";
import { ServerUrls } from "../environments/server.environments";
import { CommonHelper } from "../helpers/common.helper";

async function getByCredentialId(credentialId: number) {
  return fetch(`${ServerUrls.api}/organization/credentials/${credentialId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(CommonHelper.HandleResponse)
    .then((organization: IOrganization) => organization);
}

async function getById(id: string) {
  return fetch(`${ServerUrls.api}/organization/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(CommonHelper.HandleResponse)
    .then((organization: IOrganization) => organization);
}

async function saveOrganization(orgData: IOrganization) {
  return fetch(`${ServerUrls.api}/organization`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orgData),
  }).then(CommonHelper.HandleResponse);
}

async function getByLocation(country: string, jurisdiction: string) {
  return fetch(`${ServerUrls.api}/organization/byLocation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      country,
      jurisdiction,
    }),
  }).then(CommonHelper.HandleResponse);
}

export const organizationService = {
  getById,
  getByCredentialId,
  getByLocation,
  saveOrganization,
};

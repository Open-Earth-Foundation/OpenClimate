import IPledge from "../../api/models/DTO/Pledge/IPledge";
import { ServerUrls } from "../environments/server.environments";
import { CommonHelper } from "../helpers/common.helper";

function savePledge(orgId: string, pledge: any) {
  return fetch(`${ServerUrls.api}/${orgId}/pledge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pledge),
  }).then(CommonHelper.HandleResponse);
}

function allPledges(orgId: string) {
  return fetch(`${ServerUrls.api}/${orgId}/pledge/all`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(CommonHelper.HandleResponse)
    .then((pledges: Array<IPledge>) => pledges);
  // return []
}

async function fetchPledgesSubnational(organization: string) {
  let url = `https://data.cdp.net/resource/d4kx-9jfn.json?question_number=4.2a&organization=${organization}&$where=column_name in ('Base year', 'Target year', 'Percentage reduction target') and row_number in ('1', '3')`;
  var response = await fetch(url);
  return await response.json();
}

export const pledgeService = {
  savePledge,
  allPledges,
  fetchPledgesSubnational,
};

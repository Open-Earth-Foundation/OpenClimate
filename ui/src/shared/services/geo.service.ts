import ISubnationalGeo from "../../api/models/DTO/NestedAccounts/IGeoSubnational";
import { ServerUrls } from "../environments/server.environments";
import { CommonHelper } from "../helpers/common.helper";

function getSubnationalsByCountry(countryCode: string) {
  return fetch(`${ServerUrls.api}/geodata/country/${countryCode}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(CommonHelper.HandleResponse)
    .then((subnationalGeo: ISubnationalGeo) => subnationalGeo);
}

export const GeoService = {
  getSubnationalsByCountry,
};

import { ClimateWatchUrls } from "../environments/climate-watch.environments";
import { ClimateWatchHelper } from "../helpers/climate-watch.helper";

async function fetchIndicators() {
    const response = await fetch(ClimateWatchUrls.indicators);
    return await response.json();
}

async function fetchCategories() {
    const response = await fetch(ClimateWatchUrls.categories);
    return await response.json();
}

async function fetchSectors() {
    const response = await fetch(ClimateWatchUrls.sectors);
    return await response.json();
}

async function fetchGases() {
    const response = await fetch(ClimateWatchUrls.gases);
    return await response.json();
}

async function fetchTreatiesCountry(countryCode: string) {
    let url = await ClimateWatchHelper.GetTreatiesCountryUrl(countryCode);
    var response = await fetch(url);
    return await response.json();
}

async function fetchEmissionsCountry(countryCode: string) {
    //let url = `https://www.climatewatchdata.org/api/v1/data/historical_emissions?source_ids[]=113&gas_ids[]=332&sector_ids[]=1329&sector_ids[]=1328&sector_ids[]=1335&start_year=2018&regions[]=${value}`;
    let url = await ClimateWatchHelper.GetEmissionsCountryUrl(countryCode)

    var response = await fetch(url);
    return await response.json();
}

async function fetchPledgesCountry(countryCode: string) {
    let url = await ClimateWatchHelper.GetPledgeCountryUrl(countryCode);
    
    var response = await fetch(url);
    return await response.json();
}

export const climateWatchService = {
    fetchIndicators,
    fetchPledgesCountry,
    fetchCategories,
    fetchTreatiesCountry,
    fetchSectors,
    fetchGases,
    fetchEmissionsCountry
};
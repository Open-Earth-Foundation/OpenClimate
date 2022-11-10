
import { climateWatchService } from '../services/climate-watch.service';

async function GetPledgeCountryUrl(countryCode: string)
{
    const indicators = await climateWatchService.fetchIndicators();

    const baseYear = GetIndicatorBySlug(indicators?.data, "pledge_base_year");
    const targetYear = GetIndicatorBySlug(indicators?.data, "pledge_target_year");
    const reductionToBaseYear = GetIndicatorBySlug(indicators?.data, "M_TarA2");

    const pledgeIndicators = `indicator_ids[]=${baseYear}&indicator_ids[]=${targetYear}&indicator_ids[]=${reductionToBaseYear}`;

    return `https://www.climatewatchdata.org/api/v1/data/ndc_content?${pledgeIndicators}&countries[]=${countryCode}`;
}

async function GetTreatiesCountryUrl(countryCode: string)
{
    const indicators = await climateWatchService.fetchIndicators();
    const categories = await climateWatchService.fetchCategories();
    
    const signed = GetIndicatorBySlug(indicators?.data, "pa_sign");
    const ratified = GetIndicatorBySlug(indicators?.data, "pa_ratified");
    const category = GetIndicatorBySlug(categories?.data, "unfccc_process");

    const treatiesIndicators = `indicator_ids[]=${signed}&indicator_ids[]=${ratified}`;
    const treatiesCategories = `category_ids[]=${category}`;

    return `https://www.climatewatchdata.org/api/v1/data/ndc_content?${treatiesIndicators}&${treatiesCategories}&countries[]=${countryCode}`;
}

async function GetEmissionsCountryUrl(countryCode: string)
{
    const sectors = await climateWatchService.fetchSectors();
    const gases = await climateWatchService.fetchGases();

    //indicators
    const totalGhgEmission = GetIndicatorBySlug(sectors?.data, "total-ghg-emissions-without-lulucf");
    const totalGhgEmissionLulucf = GetIndicatorBySlug(sectors?.data, "total-ghg-emissions-with-lulucf");
    const landUse = GetIndicatorBySlug(sectors?.data, "land-use-land-use-change-and-forestry");

    //gases
    const aggregateGhg = GetIndicatorBySlug(gases?.data, "aggregate-ghgs");

    const emissionsSectors = `sector_ids[]=${totalGhgEmission}&sector_ids[]=${totalGhgEmissionLulucf}&sector_ids[]=${landUse}`;
    const emissionsGases = `gas_ids[]=${aggregateGhg}`;

    return `https://www.climatewatchdata.org/api/v1/data/historical_emissions?${emissionsSectors}&${emissionsGases}&start_year=2018&regions[]=${countryCode}`;
}

function GetIndicatorBySlug(data:[], indicatorSlug: string)
{
    const node = data.find((i: any) => i["slug"] === indicatorSlug);
    return node ? node["id"] : 0;
}

export const ClimateWatchHelper = {
    GetPledgeCountryUrl,
    GetTreatiesCountryUrl,
    GetEmissionsCountryUrl
};
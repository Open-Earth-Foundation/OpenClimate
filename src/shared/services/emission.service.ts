async function fetchEmissionsSubnational(subnational_id: number) {
    let url = `https://dev.openclimate.network/api/subnationals/2018/${subnational_id}`;
    var response = await fetch(url);
    return await response.json();
}

async function fetchEmissionsCity(city: number) {
    let url = `https://dev.openclimate.network/api/city/2021/${city}`;
    var response = await fetch(url);
    return await response.json();
}

export const emissionService = {
    fetchEmissionsSubnational,
    fetchEmissionsCity
};

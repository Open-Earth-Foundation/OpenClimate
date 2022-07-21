async function fetchEmissionsSubnational(subnational_id: number) {
    let url = `/api/subnationals/2019/${subnational_id}`;
    var response = await fetch(url);
    return await response.json();
}

async function fetchEmissionsCity(city: number) {
    let url = `/api/city/2021/${city}`;
    var response = await fetch(url);
    return await response.json();
}

export const emissionService = {
    fetchEmissionsSubnational,
    fetchEmissionsCity
};

async function fetchEmissionsSubnational(subnational: string) {
    let url = `https://data.cdp.net/resource/d4kx-9jfn.json?question_number=3.6&organization=${subnational}&column_name=Emissions of latest inventory (metric tonnes CO2e)`;
    var response = await fetch(url);
    return await response.json();
}

export const emissionService = {
    fetchEmissionsSubnational
};

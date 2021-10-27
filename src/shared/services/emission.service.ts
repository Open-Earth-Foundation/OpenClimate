export const emissionService = {
    fetchEmissionsSubnational
};


async function fetchEmissionsSubnational(subnational: string) {
    let url = `https://data.cdp.net/resource/d4kx-9jfn.json?question_number=3.6&organization=${subnational}&column_name=Emissions of latest inventory (metric tonnes CO2e)`;
    var response = await fetch(url);
    return await response.json();
}


function handleResponse(response: any) {
    return response.text().then((text: any) => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                //window.location.reload();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}
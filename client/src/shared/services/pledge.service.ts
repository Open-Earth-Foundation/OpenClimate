export const pledgeService = {
    savePledge,
    allPledges,
    fetchPledgesSubnational
};

function savePledge(pledge: any)
{
    return fetch(`http://localhost:3001/api/pledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pledge),
    }).then(handleResponse);
}

function allPledges()
{
    return fetch(`http://localhost:3001/api/pledge/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }).then(handleResponse).then((pledges:any) => {
        return Object.keys(pledges).map((key:any) => pledges[key].data);
    });
}
/*
async function fetchPledges(value: string) {
    //let url = `https://www.climatewatchdata.org/api/v1/data/ndc_content?indicator_ids[]=137124&indicator_ids[]=137380&indicator_ids[]=137126&countries[]=${value}`;
    
    var response = await fetch(url);
    return await response.json();
}*/

async function fetchPledgesSubnational(organization: string) {
    let url = `https://data.cdp.net/resource/d4kx-9jfn.json?question_number=4.2a&organization=${organization}&$where=column_name in ('Base year', 'Target year', 'Percentage reduction target') and row_number in ('1', '3')`;
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
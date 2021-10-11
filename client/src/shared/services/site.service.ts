import ISite from "../../api/models/DTO/Site/ISite";

export const siteService = {
    saveSite,
    allSites
};

function saveSite(site: ISite)
{
    return fetch(`http://localhost:3001/api/site`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(site),
    }).then(handleResponse);
}

function allSites()
{
    return fetch(`http://localhost:3001/api/site/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }).then(handleResponse).then((sites: any) => {
        return Object.keys(sites).map((key:any) => sites[key].data);
    });
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
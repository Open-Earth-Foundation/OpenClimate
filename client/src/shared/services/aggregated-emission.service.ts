import IAggregatedEmission from "../../api/models/DTO/AggregatedEmission/IAggregatedEmission";

export const climateActionService = {
    updateAggregatedEmission
};

function updateAggregatedEmission(aggregatedEmission: IAggregatedEmission)
{
    return fetch(`http://localhost:3001/api/aggregated-emission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aggregatedEmission),
    }).then(handleResponse);
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
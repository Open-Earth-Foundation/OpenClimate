import IClimateAction from "../../api/models/DTO/ClimateAction/IClimateAction";

export const climateActionService = {
    saveClimateAction,
    allClimateAction
};

function saveClimateAction(climateAction: IClimateAction)
{
    return fetch(`http://localhost:3001/api/climate-action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(climateAction),
    }).then(handleResponse);
}

function allClimateAction()
{
    return fetch(`http://localhost:3001/api/climate-action/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }).then(handleResponse).then((pledges:any) => {
        return Object.keys(pledges).map((key:any) => pledges[key].data);
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
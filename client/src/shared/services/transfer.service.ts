export const transferService = {
    saveTransfer,
    allTransfers
};

function saveTransfer(transfer: any)
{
    return fetch(`http://localhost:3001/api/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transfer),
    }).then(handleResponse);
}

function allTransfers()
{

    return fetch(`http://localhost:3001/api/transfer/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }).then(handleResponse).then((transfers:any) => {
        //debugger;
        return Object.keys(transfers).map((key:any) => transfers[key].data);
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
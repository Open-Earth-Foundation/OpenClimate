import { DemoData } from "../../api/data/demo/entities.demo";
import IOrganization from "../../api/models/DTO/Organization/IOrganization";
import { IUser } from "../../api/models/User/IUser";
import { ServerUrls } from "../environments/server.environments";
import { organizationService } from "./organization.service";

export const userService = {
    register,
    // login,
    logout,
    getCompany,
    getUserByEmail
};

function register(user: IUser)
{
    return fetch(`${ServerUrls.api}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    })
}

// function login(email: string, password: string) {

//     const requestOptions = {
//         method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({
//                 email: email,
//                 password: password
//               }),
//     };
//     return fetch(`${ServerUrls.api}/user/log-in`, requestOptions)
//             .then(handleResponse)
//             .then(response => {
//                 return response;
//             })
// }

function logout() {
   return localStorage.removeItem('user');
}
interface CompanyData {
    organization_id: number
    name: string,
    country: string,
    jurisdiction: string
}
async function getCompany(companyData: CompanyData) {
    let org = await organizationService.getByCredentialId(companyData.organization_id);

    if (Object.keys(org).length === 0 && companyData.name && companyData.country && companyData.jurisdiction)
    {
        const orgData: IOrganization = {
            organization_credential_id: companyData.organization_id.toString(),
            organization_name: companyData.name,
            organization_country: companyData.country,
            organization_jurisdiction: companyData.jurisdiction
        }

        await organizationService.saveOrganization(orgData);
        org = orgData;
    }

    return org;
}

function handleResponse(response: any) {
    return response.text().then((text: any) => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                window.location.reload();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}


async function getUserByEmail(email: string) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    };

    return fetch(`${ServerUrls.api}/get-user-by-email`, requestOptions)
        .then(handleResponse)
        .then(async user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            user.company = await userService.getCompany({organization_id: user.organizationId});
            
            sessionStorage.setItem('user', JSON.stringify(user));
            return user;
        });
}
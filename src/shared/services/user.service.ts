import IOrganization from "../../api/models/DTO/Organization/IOrganization";
import { ICompany } from "../../api/models/User/ICompany";
import { ServerUrls } from "../environments/server.environments";
import { IUser } from "../../api/models/User/IUser";
import { organizationService } from "./organization.service";

export const userService = {
    register,
    login,
    logout,
    getCompany
};

function register(user: IUser)
{
    return fetch(`${ServerUrls.api}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    })
}

function login(email: string, password: string) {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    };

    return fetch(`${ServerUrls.api}/login`, requestOptions)
        .then(handleResponse)
        .then(async user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            user.company = await userService.getCompany("12345");
            
            sessionStorage.setItem('user', JSON.stringify(user));
            return user;
        });
}

function logout() {
    return fetch(`${ServerUrls.api}/logout`)
        .then(resposne => {
            sessionStorage.removeItem('user');
        });
}

async function getCompany(credentialId: string) {
    
    let org = await organizationService.getByCredentialId(credentialId);
    if(Object.keys(org).length === 0)
    {
        //fetch orgData?
        const orgData: IOrganization = {
            organization_credential_id: credentialId,
            organization_name: "Test company"
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
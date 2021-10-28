import { ICompany } from "../../api/models/User/ICompany";
import { IUser } from "../../api/models/User/IUser";

export const userService = {
    register,
    login,
    logout,
    getCompany
};

function register(user: IUser)
{
    return fetch('http://localhost:3001/api/register', {
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

    return fetch(`http://localhost:3001/api/login`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            user.company = userService.getCompany();
            
            sessionStorage.setItem('user', JSON.stringify(user));
            return user;
        });
}

function logout() {
    return fetch(`http://localhost:3001/api/logout`)
        .then(resposne => {
            sessionStorage.removeItem('user');
        });
}

function getCompany() {
    const companyData: ICompany = {
        name: "Test company"
    }

    return companyData;
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
import IOrganization from "../DTO/Organization/IOrganization";

export interface IUser {
    id?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    email: string;
    password: string;
    company?: IOrganization,
    demo?: boolean;
    roles: string;
}
import { ICompany } from './ICompany';

export interface IUser {
    id?: number;
    firstName: string;
    lastName: string;
    name?: string;
    email: string;
    password: string;
    company?: ICompany
}
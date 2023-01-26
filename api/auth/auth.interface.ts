import { Request } from "express";

export interface IAuthUser {
  email: string;
}

interface AdditionalFields {
  user: IAuthUser;
}

export type AuthenticatedRequest = Request & AdditionalFields;

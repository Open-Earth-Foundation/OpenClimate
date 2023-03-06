import { IUser } from "../../api/models/User/IUser";

export interface UserState {
  currentUser: IUser | null;
  loading: boolean;
  loginError: string;
}

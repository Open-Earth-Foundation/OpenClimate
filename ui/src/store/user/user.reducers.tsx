import * as userActionTypes from "./user.action-types";
import { UserState } from "./user.state";

const getUserFromStorage = () => {
  const cUser = localStorage.getItem("user");
  if (cUser) return JSON.parse(cUser);
  return null;
};

const initialState: UserState = {
  loading: false,
  currentUser: getUserFromStorage(),
  loginError: "",
};

export const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case userActionTypes.START_LOADING:
      return {
        ...state,
        loading: true,
        loginError: "",
      };
    case userActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        loginError: "",
        currentUser: action.payload.user,
      };
    case userActionTypes.LOGIN_FAILED:
      return {
        ...state,
        loading: false,
        loginError: action.payload.error,
      };
    case userActionTypes.DO_LOGOUT:
      return {
        ...state,
        currentUser: null,
        loading: false,
        loginError: "",
      };
    case userActionTypes.USERS_CLEAR_STATE:
      return initialState;

    default:
      return state;
  }
};

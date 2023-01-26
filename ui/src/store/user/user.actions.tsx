import { Dispatch } from "redux";
import * as userActionTypes from "./user.action-types";
import { hideModal } from "../app/app.actions";
import { userService } from "../../shared/services/user.service";
import { IUser } from "../../api/models/User/IUser";
import { reviewClearState } from "../review/review.actions";
import { nestedAccountsClearState } from "../nested-accounts/nested-accounts.actions";
import { accountClearState } from "../account/account.actions";

export const usersClearState = () => {
  return {
    type: userActionTypes.USERS_CLEAR_STATE,
    payload: {},
  };
};

export const startLoading = () => {
  return {
    type: userActionTypes.START_LOADING,
    payload: {},
  };
};

export const login = (name: string, password: string) => {
  return {
    type: userActionTypes.DO_LOGIN,
    payload: {
      name: name,
      password: password,
    },
  };
};

export const logout = () => {
  return {
    type: userActionTypes.DO_LOGOUT,
  };
};

export const loginFailed = (error: string) => {
  return {
    type: userActionTypes.LOGIN_FAILED,
    payload: {
      error: error,
    },
  };
};

export const loginSuccess = (user: IUser) => {
  return {
    type: userActionTypes.LOGIN_SUCCESS,
    payload: {
      user,
    },
  };
};

// export const doLogin = (email: string, password: string, demo: boolean) => {
//     return async (dispatch: Dispatch) => {

//         dispatch(startLoading())
//         userService.login(email, password, demo).then( (user: IUser) =>{
//             dispatch(loginSuccess(user));
//             dispatch(hideModal());
//         }).catch(err => {
//             dispatch(loginFailed(err));
//         });
//     }
// }

export const doLogout = () => {
  return (dispatch: Dispatch) => {
    dispatch(startLoading());
    dispatch(reviewClearState());
    dispatch(nestedAccountsClearState());
    dispatch(accountClearState());
    dispatch(logout());
    userService.logout();
  };
};
/* todo
export const doLoadCompany = (user: IUser) => {
    return (dispatch: Dispatch) => {
        dispatch(startLoading())
        
        setTimeout(()=> {

            if(user) {
                dispatch(loginSuccess(user))
            }

        }, 300)
    }
}*/

export const doPaswordlessLoginSucess = (user: IUser) => {
  return async (dispatch: Dispatch) => {
    dispatch(loginSuccess(user));
    dispatch(hideModal());
  };
};

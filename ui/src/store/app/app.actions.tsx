import { Dispatch } from "redux";
import * as appActionTypes from "./app.action-types";

export const showModal = (entityType: string, parameters?: object) => {
  return {
    type: appActionTypes.SHOW_MODAL,
    payload: {
      entityType,
      parameters,
    },
  };
};

export const hideModal = () => {
  return {
    type: appActionTypes.HIDE_MODAL,
  };
};

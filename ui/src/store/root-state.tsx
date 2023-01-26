import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { AccountState } from "./account/account.state";
import { AppState } from "./app/app.state";
import { NestedAccountsState } from "./nested-accounts/nested-accounts.state";
import { ReviewState } from "./review/review.state";
import { UserState } from "./user/user.state";

export interface RootState {
  app: AppState;
  review: ReviewState;
  users: UserState;
  account: AccountState;
  nestedAccounts: NestedAccountsState;
}

export type DispatchThunk = ThunkDispatch<RootState, void, Action>;

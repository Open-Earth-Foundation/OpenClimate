import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { reviewReducer } from "./review/review.reducers";
import { userReducer } from "./user/user.reducers";
import thunk from "redux-thunk";
import { RootState } from "./root-state";
import { appReducer } from "./app/app.reducers";
import { accountReducer } from "./account/account.reducers";
import { nestedAccountsReducer } from "./nested-accounts/nested-accounts.reducers";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const persistConfig = {
  key: "root",
  blacklist: ["account", "nestedAccounts", "review"],
  storage,
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers<RootState>({
  app: appReducer,
  users: userReducer,
  review: reviewReducer,
  account: accountReducer,
  nestedAccounts: nestedAccountsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  {},
  composeEnhancers(applyMiddleware(thunk))
);

const Persistor = persistStore(store);

export { Persistor };

export default store;

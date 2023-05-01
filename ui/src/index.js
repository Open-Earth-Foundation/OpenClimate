import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

import reportWebVitals from "./reportWebVitals";
import "./shared/css/fonts.css";
import "./shared/css/styles.scss";
import { Provider } from "react-redux";
import store, { Persistor } from "./store/index";
import "react-datepicker/dist/react-datepicker.css";
import { PersistGate } from "redux-persist/integration/react";
import { MatomoProvider, createInstance } from "@jonkoops/matomo-tracker-react";

let matomoCredentials;

fetch(`/config.json`).then((res) => {
  return res.json();
}).then((data) => {
  matomoCredentials = {
    trackerURL: data.matomoServer,
    siteID: data.matomoSiteID
  }
});

const instance =
  createInstance({
    urlBase: "https://matomo.openearth.foundation/",
    siteId: 1,
  });

ReactDOM.render(
  <MatomoProvider value={instance}>
    <Provider store={store}>
      <PersistGate Loading={null} persistor={Persistor}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </PersistGate>
    </Provider>
  </MatomoProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

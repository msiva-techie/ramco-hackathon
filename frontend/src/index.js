import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
// import * as serviceWorker from './serviceWorker';

import axios from "axios";
import { getToken } from "./services/AuthenticationService";
import { useHistory } from "react-router";

axios.interceptors.request.use(function(config) {
  const token = getToken();
  if (token) config.headers.token = token;
  return config;
});

axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (error.response && 401 === error.response.status) {
      const history = useHistory();
      history.push("/login");
    } else {
      return Promise.reject(error.response);
    }
  }
);

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

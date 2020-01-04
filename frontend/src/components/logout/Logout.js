import React, { Component } from "react";
import { logout } from "../../services/AuthenticationService";
import { Redirect } from "react-router-dom";

export class Logout extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const p = this.props;
    (async function() {
      const response = await logout({});
      p.setAuthenticated(false);
      console.log("loggedout....", response.message);
    })();

    return <Redirect to="/" />;
  }
}

export default Logout;

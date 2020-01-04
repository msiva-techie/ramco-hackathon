import React, { Component } from "react";
import styles from "./Login.module.css";
import { login } from "../../services/AuthenticationService";
import { withRouter } from "react-router-dom";

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        emailId: "",
        password: ""
      }
    };
  }
  login = async e => {
    e.preventDefault();
    console.log("formData...", this.state);
    let response = await login(this.state.formData);
    console.log("response...", response);
    console.log("This.props...", this.props);
    if (response.user === 1) {
      this.props.setAuthenticated(true);
      this.props.history.push("/home");
    } else {
      this.props.setAuthenticated(false);
      const message = response.message
        ? response.message
        : "Failed to login user";
      alert(message);
    }
  };

  render() {
    return (
      <div>
        <div className={`card ${styles.loginCard}`}>
          <div className="card-body">
            <h5 className="card-title">Login</h5>
            <p className="card-text">
              <form onSubmit={this.login}>
                <div
                  className={`form-group ${styles.formElement}`}
                  style={{ margin: "30px 0" }}
                >
                  <input
                    type="email"
                    className="form-control"
                    name="emailId"
                    id="emailId"
                    value={this.state.formData.emailId}
                    onChange={e => {
                      this.setState({
                        formData: {
                          ...this.state.formData,
                          emailId: e.target.value
                        }
                      });
                    }}
                    aria-describedby="emailHelp"
                    placeholder="Enter your Email Id"
                    required
                  />
                </div>
                <div className={`form-group ${styles.formElement}`}>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={this.state.formData.password}
                    onChange={e => {
                      this.setState({
                        formData: {
                          ...this.state.formData,
                          password: e.target.value
                        }
                      });
                    }}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <button type="submit" className={`btn btn-primary`}>
                  Log in
                </button>
              </form>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);

import React, { Component } from "react";
import styles from "./Register.module.css";
import { signup } from "../../services/AuthenticationService";
import { withRouter } from "react-router-dom";

export class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        emailId: "",
        userName: "",
        fullName: "",
        dateOfBirth: "",
        password: "",
        confirmPassword: "",
        gender: ""
      }
    };
  }

  registerUser = async e => {
    e.preventDefault();
    console.log("formData...", this.state);
    if (this.state.password === this.state.confirmPassword) {
      let response = await signup(this.state.formData);
      console.log("response...", response);
      if (response.user === 1) {
        this.props.history.push("/login");
      } else {
        const message = response.message
          ? response.message
          : "Failed to register user";
        alert(message);
      }
    }
  };

  render() {
    return (
      <div>
        <div className={`card ${styles.signupCard}`}>
          <div className="card-body">
            <h5 className="card-title">Signup</h5>
            <p className="card-text">
              <form onSubmit={this.registerUser}>
                <div
                  className={`form-group ${styles.formElement}`}
                  style={{ "margin-top": "30px" }}
                >
                  <input
                    type="email"
                    className="form-control"
                    name="emailId"
                    id="emailId"
                    value={this.state.formData.emailId}
                    onChange={e => {
                      console.log("value...", e.target.value);
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
                    type="text"
                    className="form-control"
                    id="userName"
                    value={this.state.formData.userName}
                    onChange={e => {
                      this.setState({
                        formData: {
                          ...this.state.formData,
                          userName: e.target.value
                        }
                      });
                    }}
                    name="userName"
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div className={`form-group ${styles.formElement}`}>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    value={this.state.formData.fullName}
                    onChange={e => {
                      this.setState({
                        formData: {
                          ...this.state.formData,
                          fullName: e.target.value
                        }
                      });
                    }}
                    name="fullName"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className={styles.formElement}>Birthday</div>
                <div className="form-group">
                  <input
                    type="date"
                    className="form-control"
                    id="dateOfBirth"
                    value={this.state.formData.dateOfBirth}
                    onChange={e => {
                      this.setState({
                        formData: {
                          ...this.state.formData,
                          dateOfBirth: e.target.value
                        }
                      });
                    }}
                    name="dateOfBirth"
                    placeholder="Enter your DOB"
                    required
                  />
                </div>
                <div className={`form-group ${styles.formElement}`}>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={this.state.formData.password}
                    onChange={e => {
                      this.setState({
                        formData: {
                          ...this.state.formData,
                          password: e.target.value
                        }
                      });
                    }}
                    name="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <div className={`form-group ${styles.formElement}`}>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={this.state.formData.confirmPassword}
                    onChange={e => {
                      this.setState({
                        formData: {
                          ...this.state.formData,
                          confirmPassword: e.target.value
                        }
                      });
                    }}
                    onFocus={e => {
                      this.setState({ ...this.state, onfocus: true });
                    }}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    required
                  />
                  {this.state.formData.password !==
                    this.state.formData.confirmPassword &&
                  this.state.onfocus ? (
                    <small className="form-text text-danger">
                      Please enter the same password as above
                    </small>
                  ) : (
                    true
                  )}
                </div>
                <div>Gender</div>
                <div class="form-check">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="male"
                      value={this.state.formData.gender}
                      checked={this.state.formData.gender === "male"}
                      onChange={e => {
                        this.setState({
                          formData: { ...this.state.formData, gender: "male" }
                        });
                      }}
                      required
                    />
                    <label className="form-check-label" htmlFor="male">
                      Male
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="female"
                      value={this.state.formData.gender}
                      checked={this.state.formData.gender === "female"}
                      onChange={e => {
                        this.setState({
                          formData: { ...this.state.formData, gender: "female" }
                        });
                      }}
                    />
                    <label className="form-check-label" htmlFor="female">
                      Female
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className={`btn btn-primary ${styles.formElement}`}
                >
                  Sign up
                </button>
              </form>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Register);

import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import { Home } from "./components/home/Home";
import { Login } from "./components/login/Login";
import { Register } from "./components/register/Register";
import "./App.css";
import { isAuthenticated } from "./services/AuthenticationService";
import Logout from "./components/logout/Logout";
import Product from "./components/product/Product";
import Order from "./components/order/Order";
import Location from "./components/location/Location";
// (function() {
// 	const token = getToken();
// 	if (token) {
// 		axios.defaults.headers.common['token'] = token;
// 	} else {
// 		axios.defaults.headers.common['token'] = null;
// 		/*if setting null does not remove `Authorization` header then try
// 		  delete axios.defaults.headers.common['Authorization'];
// 		*/
// 	}
// })();

class PrivateRoute extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }
  render() {
    // const {component:Component,...rest} = this.props;
    let render, Component;
    let flag = 0;
    if (this.props.render) {
      render = this.props.render;
      flag = 1;
    } else {
      Component = this.props.Component;
    }
    console.log("isAuthenticated...", isAuthenticated());
    return (
      <Route
        {...this.props}
        render={props => {
          return isAuthenticated() ? (
            flag ? (
              render(props)
            ) : (
              <Component {...props} />
            )
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  from: props.location
                }
              }}
            />
          );
        }}
      />
    );
  }
}

class LoginRoute extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }
  render() {
    let render, Component;
    let flag = 0;
    console.log("props....", this.props);
    if (this.props.render) {
      render = this.props.render;
      flag = 1;
    } else {
      Component = this.props.component;
      console.log("Component.....", Component);
    }
    let result = JSON.parse(JSON.stringify(this.props));
    delete result["component"];
    console.log("props....", this.props);
    console.log("isAuthenticated...", isAuthenticated());
    return (
      <Route
        {...result}
        render={props => {
          return isAuthenticated() ? (
            <Redirect to="/home" />
          ) : flag ? (
            render(props)
          ) : (
            <Component {...props} />
          );
        }}
      />
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false
    };
  }

  updateState = result => {
    this.setState({
      isAuthenticated: result
    });
  };
  render() {
    return (
      <div>
        <Router>
          <div>
            <nav
              className="navbar navbar-expand-sm bg-dark navbar-dark"
              style={{ justifyContent: "space-between" }}
            >
              <div>
                <Link className="navbar-brand" to="/home">
                  Smart Grid
                </Link>
              </div>
              <div>
                <ul className="navbar-nav">
                  {!this.state.isAuthenticated ? (
                    <li className="nav-item active">
                      <Link className="nav-link" to="/login">
                        Login
                      </Link>
                    </li>
                  ) : (
                    true
                  )}
                  {!this.state.isAuthenticated ? (
                    <li className="nav-item active">
                      <Link className="nav-link" to="/register">
                        Signup
                      </Link>
                    </li>
                  ) : (
                    true
                  )}
                  {this.state.isAuthenticated ? (
                    <li className="nav-item active">
                      <Link className="nav-link" to="/logout">
                        Logout
                      </Link>
                    </li>
                  ) : (
                    true
                  )}
                </ul>
              </div>
            </nav>
            {/* A <Switch> looks through its children <Route>s and
						renders the first one that matches the current URL. */}
            <Switch>
              <PrivateRoute
                path="/item/order"
                render={props => {
                  return (
                    <Order setAuthenticated={this.updateState} {...props} />
                  );
                }}
              />
              <PrivateRoute
                path="/kids"
                render={props => {
                  return (
                    <Product setAuthenticated={this.updateState} {...props} />
                  );
                }}
              />
              <PrivateRoute
                path="/sunglasses"
                render={props => {
                  return (
                    <Product setAuthenticated={this.updateState} {...props} />
                  );
                }}
              />
              <PrivateRoute
                path="/topwears"
                render={props => {
                  return (
                    <Product setAuthenticated={this.updateState} {...props} />
                  );
                }}
              />
              <PrivateRoute
                path="/watches"
                render={props => {
                  return (
                    <Product setAuthenticated={this.updateState} {...props} />
                  );
                }}
              />
              <PrivateRoute
                path="/shoes"
                render={props => {
                  return (
                    <Product setAuthenticated={this.updateState} {...props} />
                  );
                }}
              />
              <PrivateRoute
                path="/bottomwears"
                render={props => {
                  return (
                    <Product setAuthenticated={this.updateState} {...props} />
                  );
                }}
              />
              <PrivateRoute
                path="/home"
                render={props => {
                  return (
                    <Home setAuthenticated={this.updateState} {...props} />
                  );
                }}
              />
              <LoginRoute path="/register" component={Register} />
              <LoginRoute
                path="/login"
                render={props => {
                  return (
                    <Login setAuthenticated={this.updateState} {...props} />
                  );
                }}
              />
              <Route
                path="/logout"
                render={props => {
                  return (
                    <Logout setAuthenticated={this.updateState} {...props} />
                  );
                }}
              />
              <Redirect from="/**/" to="/login" />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;

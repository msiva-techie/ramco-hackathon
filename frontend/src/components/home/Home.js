import React, { Component } from "react";

export class Home extends Component {
  componentDidMount() {
    this.props.setAuthenticated(true);
  }

  render() {
    return (
      <div>
        <h1
          style={{
            textAlign: "center",
            marginTop: "5%"
          }}
        >
          Welcome to Home!!
        </h1>
      </div>
    );
  }
}

export default Home;

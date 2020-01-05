import React, { Component } from "react";
import { withRouter } from "react-router";
import "./Order.css";
import { geolocated } from "react-geolocated";
import { getResult } from "./../../services/ProductService";

export class Order extends Component {
  constructor() {
    super();
    this.productName = localStorage.getItem("productName");
    console.log("product name.....", this.productName);
    localStorage.removeItem("productName");
    this.state = {
      count: 0,
      result: ""
    };
  }
  componentDidMount() {
    this.props.setAuthenticated(true);
  }
  getETA = async () => {
    if (this.props.coords) {
      console.log("latitude...", this.props.coords.latitude);
      console.log("longitude...", this.props.coords.longitude);
      this.output = await getResult({
        latitude: this.props.coords.latitude,
        longitude: this.props.coords.longitude,
        productName: this.productName,
        count: this.state.count
      });
      this.setState({
        ...this.state,
        result: this.output
      });
      console.log("output....", this.output);
    } else {
      alert("Location not available");
    }
  };
  increment = () => {
    this.setState({
      count: this.state.count + 1
    });
  };
  decrement = () => {
    this.setState({
      count: this.state.count > 0 ? this.state.count - 1 : 0
    });
  };
  render() {
    return (
      <div className="container">
        <div style={{ float: "left" }}>
          <div className="card1" style={{ marginLeft: "80px" }}>
            (
            <img
              src={require("./../../result.png")}
              style={{
                width: "100%",
                height: "350px",
                marginTop: "0"
              }}
              className="img1"
              alt="picture"
            />
            )<span style={{ fontSize: "18px", fontWeight: "bold" }}></span>
          </div>
          <div className="submit" style={{ marginLeft: "80px" }}>
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
              <div style={{ marginTop: "100px", marginLeft: "20px" }}>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    this.decrement();
                  }}
                >
                  Decrement
                </button>
                <span style={{ marginLeft: "80px" }}>
                  {this.state.count} quantity
                </span>

                <button
                  className="btn btn-outline-primary"
                  style={{ marginLeft: "100px" }}
                  onClick={() => {
                    this.increment();
                  }}
                >
                  Increment
                </button>
                <button
                  className="btn btn-outline-primary"
                  style={{
                    marginLeft: "40px",
                    marginTop: "50px",
                    width: "80%"
                  }}
                  onClick={() => {
                    this.getETA();
                  }}
                >
                  order
                </button>
              </div>
            </span>
          </div>
          <div></div>
          {this.state.result ? (
            <div className="card output">
              <div className="card-body">
                <h5 className="card-title">Order Details</h5>
                <p className="card-text">
                  {this.state.result ? (
                    <ul>
                      <li>ETA: {this.state.result.ETA}</li>
                      <li>Distance:{this.state.result.distance}</li>
                      <li>
                        Name of the Delivery person:
                        {this.state.result.result.deliveryBoy.name}
                      </li>
                      <li>
                        Location of the Shop: {this.state.result.result.shop}
                      </li>
                      <li>
                        Location of the user:{this.props.coords.latitude}{" "}
                        {this.props.coords.longitude}
                      </li>
                    </ul>
                  ) : (
                    ""
                  )}
                </p>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}
export default geolocated({
  positionOptions: {
    enableHighAccuracy: false
  },
  userDecisionTimeout: 5000
})(Order);

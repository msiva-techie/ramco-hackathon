import React, { Component } from "react";
import { withRouter } from "react-router";
import "./Order.css";
import { geolocated } from "react-geolocated";
import { getResult } from "../../services/ProductService";
import Map from "../map/Map";

export class Order extends Component {
  constructor() {
    super();
    this.productName = localStorage.getItem("productName");
    console.log("product name.....", this.productName);
    // localStorage.removeItem("productName");
    this.state = {
      count: 0,
      result: this.output,
      order: false
    };
  }
  componentDidMount() {
    this.props.setAuthenticated(true);
  }
  getETA = async () => {
    console.log("props...", this.props);
    if (this.props.coords) {
      console.log("latitude...", this.props.coords.latitude);
      console.log("longitude...", this.props.coords.longitude);
      this.output = await getResult({
        latitude: this.props.coords.latitude,
        longitude: this.props.coords.longitude,
        productName: this.productName,
        count: this.state.count
      });
      if (this.output.stock === 0) {
        this.setState({
          ...this.state,
          order: false
        });
        alert(this.output.message);
      } else {
        this.setState({
          ...this.state,
          result: this.output,
          order: false
        });
      }

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
        {/* {this.state.result ? ( */}
        <div className="grid">
          <div>
            <img
              src={require("./../../result.png")}
              style={{
                width: "300px",
                height: "200px"
              }}
              className="img1"
              alt="picture"
            />
          </div>
          <div>
            <div class="card">
              <div class="card-body">
                <h5 class="card-title" style={{ textAlign: "center" }}>
                  How many {this.productName} do you need?
                </h5>
                <p class="card-text" style={{ marginTop: "20px" }}>
                  <div className="quantity" style={{ fontSize: "50px" }}>
                    <button
                      type="button"
                      className="btn btn-dark inc"
                      onClick={() => {
                        this.decrement();
                      }}
                    >
                      -
                    </button>
                    <span> {this.state.count} </span>
                    <button
                      type="button"
                      className="btn btn-dark inc"
                      onClick={() => {
                        this.increment();
                      }}
                    >
                      +
                    </button>
                  </div>
                </p>
              </div>
            </div>

            <div>
              <button
                type="button"
                className="btn btn-dark order "
                onClick={() => {
                  if (this.state.count > 0) {
                    this.setState({
                      ...this.state,
                      order: true
                    });
                    this.getETA();
                  } else {
                    alert(
                      "Select the number of quantity. Quantity should not be 0"
                    );
                  }
                }}
              >
                order
              </button>
            </div>
          </div>
        </div>
        {this.state.order ? (
          <div
            class="spinner-border spn"
            style={{ width: "3rem", height: "3rem" }}
            role="status"
          >
            <span class="sr-only">Loading...</span>
          </div>
        ) : (
          ""
        )}
        {this.state.result ? (
          <div className="output" style={{ fontSize: "20px" }}>
            <div className="card box">
              <div className="card-body">
                <h4 className="card-title" style={{ fontSize: "30px" }}>
                  Order Details
                </h4>
                <h3 style={{ textAlign: "center" }}>
                  Your order has been placed successfully!!!
                </h3>
                <p className="card-text" style={{ marginTop: "20px" }}>
                  <ul style={{ listStyle: "none" }}>
                    <li>
                      <h4>
                        ETA: You will receive your order in{" "}
                        {this.state.result.ETA}
                        mins.
                      </h4>
                    </li>
                    <li>
                      Distance between you and the shop:{" "}
                      {this.state.result.distance}km.
                    </li>
                    <li>
                      {this.state.result.result.deliveryBoy.name} is picking up
                      your order and he/she is on the way.
                    </li>
                    <li>
                      Location of the Shop: {this.state.result.result.shop[0]}{" "}
                      {this.state.result.result.shop[1]}
                    </li>
                    <li>
                      Your Location:{this.props.coords.latitude}{" "}
                      {this.props.coords.longitude}
                    </li>
                  </ul>
                </p>
              </div>
            </div>
            <div className="map">
              <Map
                height="500px"
                width="1100px"
                sourceLatitude={this.state.result.result.shop[0]}
                sourceLongitude={this.state.result.result.shop[1]}
                destinationLatitude={this.props.coords.latitude}
                destinationLongitude={this.props.coords.longitude}
              />
            </div>
          </div>
        ) : (
          ""
        )}
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

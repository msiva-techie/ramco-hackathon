import React, { Component } from "react";
// import showCase from "./../../../src/images.jpeg";
import "./Home.css";
import { withRouter } from "react-router";
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
          <img
            src={require("./../../images.jpg")}
            className="showCase"
            alt="showcase"
          />
          {/* Welcome to Home!! */}
          <div
            style={{
              marginLeft: "200px",
              display: "float",
              float: "left"
            }}
          >
            <div
              className="card1"
              onClick={() => {
                this.props.history.push("/watches");
              }}
            >
              <span>
                Watches
                <img
                  src={require("./../../watch.jpeg")}
                  alt="picture"
                  className="img1"
                />
              </span>
            </div>
            <div
              className="card1"
              onClick={() => {
                this.props.history.push("/shoes");
              }}
              style={{
                color: "white",
                backgroundColor: "black"
              }}
            >
              <span>
                Shoes
                <img
                  src={require("./../../shoes.jpeg")}
                  style={{
                    width: "100%",
                    height: "350px",
                    marginTop: "0"
                  }}
                  className="img1"
                  alt="picture"
                />
              </span>
            </div>
            <div
              className="card1"
              onClick={() => {
                this.props.history.push("/bottomwears");
              }}
            >
              <span>
                Bottom Wears
                <img
                  src={require("./../../bottomWear.jpeg")}
                  className="img1"
                  alt="picture"
                  style={{
                    width: "100%",
                    height: "350px",
                    marginTop: "0"
                  }}
                />
              </span>
            </div>
            <div
              className="card1"
              onClick={() => {
                this.props.history.push("/topwears");
              }}
            >
              <span>
                Top Wear
                <img
                  src={require("./../../topWear.jpeg")}
                  style={{
                    width: "100%",
                    height: "350px",
                    marginTop: "0"
                  }}
                  className="img1"
                  alt="picture"
                />
              </span>
            </div>
            <div
              className="card1"
              onClick={() => {
                this.props.history.push("/sunglasses");
              }}
            >
              <span>
                Sun Glasses
                <img
                  src={require("./../../sunGlasses.jpeg")}
                  className="img1"
                  alt="picture"
                  style={{
                    width: "100%",
                    height: "350px",
                    marginTop: "0",
                    overFit: "content"
                  }}
                />
              </span>
            </div>
            <div
              className="card1"
              onClick={() => {
                this.props.history.push("/kids");
              }}
            >
              <span>
                Kids
                <img
                  src={require("./../../kids.jpeg")}
                  className="img1"
                  style={{
                    width: "100%",
                    height: "350px",
                    marginTop: "0",
                    overFit: "content"
                  }}
                />
              </span>
            </div>
            <div style={{ clear: "both", marginBottom: "20px" }}></div>
            {/* <card1 heading="Watches" imgURL="./../../watch.jpeg" />
            <card1 heading="Shoes" imgURL="./../../shoes.jpeg" />
            <card1 heading="Top Wear" imgURL="./../../topWear.jpeg" />
            <card1 heading="Bottom Wear" imgURL="./../../bottomWear.jpeg" />
            <card1 heading="Sunglasses" imgURL="./../../sunGlasses.jpeg" />
            <card1 heading="Kids" imgURL="./../../kids.jpeg" /> */}
          </div>
        </h1>
      </div>
    );
  }
}

export default withRouter(Home);

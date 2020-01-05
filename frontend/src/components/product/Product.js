import React, { Component } from "react";
// import "./Product.css";
import { withRouter } from "react-router";

import { getProducts } from "../../services/ProductService";

export class Product extends Component {
  constructor() {
    super();
    this.state = {
      products: ""
    };
    this.list = [];
  }
  async componentDidMount() {
    this.props.setAuthenticated(true);
    let result = await getProducts();
    this.setState({
      products: result.products
    });
  }
  render() {
    return (
      <div>
        {this.state.products &&
          this.state.products.map((item, index) => {
            return (
              <div
                className="card1"
                style={{ marginLeft: "80px" }}
                onClick={() => {
                  // this.props.history.push(`/item/order/${item}`);
                  // this.props.history.push({
                  //   pathname: "/item/order/",
                  //   state: { productName: item }
                  // });
                  localStorage.setItem("productName", item);
                  this.props.history.push(`/item/order/`);
                }}
              >
                {index % 2 ? (
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
                ) : (
                  <img
                    src={require("./../../watch.jpeg")}
                    style={{
                      width: "100%",
                      height: "350px",
                      marginTop: "0"
                    }}
                    className="img1"
                    alt="picture"
                  />
                )}
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                  {item}
                </span>
              </div>
            );
          })}
      </div>
    );
  }
}

export default withRouter(Product);

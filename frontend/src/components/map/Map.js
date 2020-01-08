import React, { Component } from "react";
import Iframe from "react-iframe";

export class Map extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Iframe
        url={`http://127.0.0.1:5500/demo.html?sourceLatitude=${this.props.sourceLatitude}&sourceLongitude=${this.props.sourceLongitude}&destinationLatitude=${this.props.destinationLatitude}&destinationLongitude=${this.props.destinationLongitude}`}
        width={this.props.width}
        height={this.props.height}
        id="myId"
        className="myClassname"
        display="initial"
        position="relative"
      />
    );
  }
}

export default Map;

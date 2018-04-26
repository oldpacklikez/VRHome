import "aframe";
import "babel-polyfill";
import React from "react";
import { Entity } from "aframe-react";
class Camview extends React.Component {
  state = {
    color: "black",
    pos: {
      x: -1,
      y: 1.6,
      z: -3
    }
  };

  trigColorIn() {
    this.setState({
      color: "blue"
    });
  }
  trigColorOut() {
    this.setState({
      color: "black"
    });
  }
  movePointA() {
    this.setState({
      pos: "-1 1.6 -3"
      // "-1 1.6 -5.441"
    });
  }

  movePointB() {
    this.setState({
      pos: "-1 1.6 4"
      // "-1 1.6 5"
    });
  }

  movePointC() {
    this.setState({
      pos: {
        x: -5,
        y: 1.6,
        z: -2
      }
      //  "-5 1.6 -2"
    });
  }

  movePointD() {
    this.setState({
      pos: {
        x: -6,
        y: 1.6,
        z: 5
      }
      // -6 1.6 5
    });
  }
  render() {

    return (
      <Entity>
        <Entity
          events={{
            mouseenter: this.trigColorIn.bind(this),
            mouseleave: this.trigColorOut.bind(this),
            click: this.movePointA.bind(this)
          }}
          //Move to A point
        >
          <Entity
            primitive="a-circle"
            rotation="-90 0 0"
            position="-1 0.3 -3"
            scale="0.3 0.3 0.3"
            color={this.state.color}
            shadow
          />
        </Entity>
        {
          //Move to B point
        }
        <Entity
          events={{
            mouseenter: this.trigColorIn.bind(this),
            mouseleave: this.trigColorOut.bind(this),
            click: this.movePointB.bind(this)
          }}
        >
          <Entity
            primitive="a-circle"
            rotation="-90 0 0"
            position="-1 0.3 5"
            scale="0.3 0.3 0.3"
            color={this.state.color}
          />
        </Entity>
        {
          //Move to C point
        }
        <Entity
          events={{
            mouseenter: this.trigColorIn.bind(this),
            mouseleave: this.trigColorOut.bind(this),
            click: this.movePointC.bind(this)
          }}
        >
          <Entity
            primitive="a-circle"
            rotation="-90 0 0"
            position="-5 0.3 -2"
            scale="0.3 0.3 0.3"
            color={this.state.color}
          />
        </Entity>
        <Entity
          events={{
            mouseenter: this.trigColorIn.bind(this),
            mouseleave: this.trigColorOut.bind(this),
            click: this.movePointD.bind(this)
          }}
        >
          <Entity
            primitive="a-circle"
            rotation="-90 0 0"
            position="-6 0.3 5"
            scale="0.3 0.3 0.3"
            color={this.state.color}
          />
        </Entity>

        <Entity camera look-controls position={this.state.pos}>
     
          {this.props.cursor && (
            <Entity
              cursor="fuse: true; fuseTimeout: 500"
              position="0 0 -0.5"
              geometry="primitive: ring; radiusInner: 0.0001; radiusOuter: 0.005"
              material="color: pink; shader: flat"
            />
          )}
        </Entity>
      </Entity>
    );
  }
}

export default Camview;

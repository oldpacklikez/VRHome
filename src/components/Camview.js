import 'aframe';
import 'babel-polyfill';
import React from 'react';
import { Entity } from 'aframe-react';
class Camview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color :"black",
            pos : {
                x: -1,
                y: 0.8,
                z: -3
            }
        };

    }

    trigColorIn() {
        this.setState({
            color: "blue"
        })
    }
    trigColorOut() {
        this.setState({
            color: "black"
        })
    }
    movePointA(){
        this.setState({
            pos : {
                x: -1,
                y: 2.4,
                z: -3
            }
            // "-1 2.4 -5.441"
        })
    }

    movePointB(){
        this.setState({
            pos : {
                x: -1,
                y: 2.4,
                z: 4
            } 
            // "-1 2.4 5"
        })
    }

    movePointC(){
        this.setState({
            pos : {
                x: -5,
                y: 2.4,
                z: -2
            }
            //  "-5 2.4 -2"
        })
    }

    movePointD(){
        this.setState({
            pos : {
                x: -6,
                y: 2.4,
                z: 5
            }
            // -6 2.4 5
        })
    }
    render() {
        return (
            <Entity>

                {//Move to A point 
                }
                <Entity events={{
                    mouseenter: () => this.trigColorIn.bind(this),
                    mouseleave: () => this.trigColorOut.bind(this),
                    click: this.movePointA.bind(this)
                }}>
                    <Entity primitive="a-circle"
                        rotation="-90 0 0"
                        position="-1 0.3 -3"
                        scale="0.3 0.3 0.3"
                        color={this.state.color}

                    >
                    </Entity>
                </Entity>
                 {//Move to B point 
                }
                 <Entity events={{
                    mouseenter: this.trigColorIn.bind(this),
                    mouseleave: this.trigColorOut.bind(this),
                    click: this.movePointB.bind(this)
                }}>
                    <Entity primitive="a-circle"
                        rotation="-90 0 0"
                        position="-1 0.3 5"
                        scale="0.3 0.3 0.3"
                        color={this.state.color}

                    >
                    </Entity>
                </Entity>
                 {//Move to C point 
                }
                 <Entity events={{
                    mouseenter: this.trigColorIn.bind(this),
                    mouseleave: this.trigColorOut.bind(this),
                    click: this.movePointC.bind(this)
                }}>
                    <Entity primitive="a-circle"
                        rotation="-90 0 0"
                        position="-5 0.3 -2"
                        scale="0.3 0.3 0.3"
                        color={this.state.color}

                    >
                    </Entity>
                </Entity>
                <Entity events={{
                    mouseenter: this.trigColorIn.bind(this),
                    mouseleave: this.trigColorOut.bind(this),
                    click: this.movePointD.bind(this)
                }}>
                    <Entity primitive="a-circle"
                        rotation="-90 0 0"
                        position="-6 0.3 5"
                        scale="0.3 0.3 0.3"
                        color={this.state.color}

                    >
                    </Entity>
                </Entity>

                <Entity camera="userHeight: 1.6 " look-controls position={{ x: this.state.pos.x, y: this.state.pos.y, z: this.state.pos.z}}>
                     {/* <Entity cursor="fuse: true; fuseTimeout: 500"
                        position= "0 0 -0.5"
                        geometry="primitive: ring; radiusInner: 0.0001; radiusOuter: 0.005"
                        // material="color: black; shader: flat"

                    />  */}
                    
                </Entity>

                {/* <Entity
                    //teleport-controls="cameraRig: #cameraRig"
                    daydream-controls
                    
                /> */}
               
            </Entity>
        );
    }
}


export default Camview;
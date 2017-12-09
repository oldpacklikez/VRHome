import 'aframe';
import 'babel-polyfill';
import { Entity, Scene } from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';
import Bulb from './components/Bulb'
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: 'red',
      bulb: false
    };

  }

 changeBulb() {
    this.setState({
      bulb: !(this.state.bulb)
    });
    console.log('Change bulb ' + this.state.bulb)
  }
  bulbOn() {
    this.setState({
      bulb: true
    })
  }
  bulbOff() {
    this.setState({
      bulb: false
    })
  }
  fuse() {
    console.log('fusing')
  }


  render() {
    return (
      <Scene>
        <a-assets>
          <img id="groundTexture" src="https://cdn.aframe.io/a-painter/images/floor.jpg" />
          <img id="skyTexture" src="https://cdn.aframe.io/a-painter/images/sky.jpg" />
          <a-asset-item id="off" src="/model/scene.gltf" />
          <a-asset-item id="on" src="/model/bulb_open.gltf" />
        </a-assets>

        <Entity primitive="a-plane" src="#groundTexture" rotation="-90 0 0" height="100" width="100" />
        <Entity primitive="a-light" type="ambient" color="#445451" />
        <Entity primitive="a-light" type="point" intensity="2" position="2 4 4" />
        <Entity primitive="a-sky" height="2048" radius="30" src="#skyTexture" theta-length="90" width="2048" />

        <Entity primitive="a-plane" height="1" width="1" rotation="0 -15 0" color={this.state.bulb?'green':'white'} position={{ x: 3, y: 4, z: -4 }}
          events={{
            click: this.bulbOn.bind(this)
          }}>
          <Entity text={{ value: 'On', color: 'black', width: 4, align: 'center' }} />
        </Entity>

        <Entity primitive="a-plane" height="1" width="1" rotation="0 -15 0" color={this.state.bulb?'white':'red'} position={{ x: 4, y: 4, z: -3.7 }}
          events={{
            click: this.bulbOff.bind(this)
          }}>>
        <Entity text={{ value: 'Off', color: 'black', width: 4, align: 'center' }} />
        </Entity>
        <Entity daydream-controls="hand: left"></Entity>
        <Entity gltf-model={this.state.bulb ? "#on" : "#off"}
          position={{ x: 0, y: 4, z: -3 }}
          scale={{ x: 0.25, y: 0.25, z: 0.25 }}

        />
  
        <Entity primitive="a-camera" camera={{ userHeight: 1.6 }}>
          <a-entity cursor="fuse: true; fuseTimeout: 500"
            position="0 0 -1"
            geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
            material="color: black; shader: flat">
          </a-entity>
        </Entity>
      </Scene>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#sceneContainer'));

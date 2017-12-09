import 'aframe';
import 'babel-polyfill';
import { Entity, Scene } from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: 'red',
      bulb: false
    };

  }

  changeColor() {
    const colors = ['red', 'orange', 'yellow', 'green', 'blue'];
    this.setState({
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  changeBulb() {
    this.setState({
      bulb: !(this.state.bulb)
    });
    console.log('Change bulb ' + this.state.bulb)
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

        <Entity text={{ value: 'Hello, A-Frame React!', align: 'center' }} position={{ x: 0, y: 2, z: -1 }} />

       {/* <Entity id="box"
          geometry={{ primitive: 'box' }}
          material={{ color: this.state.color, opacity: 0.6 }}

          position={{ x: 0, y: 1, z: -3 }}
          events={{
            click: this.changeColor.bind(this),
            fusing: this.fuse.bind(this)
          }}>
          <Entity animation__scale={{ property: 'scale', dir: 'alternate', dur: 100, loop: true, to: '2 2 2' }}
            geometry={{ primitive: 'box', depth: 0.2, height: 0.2, width: 0.2 }}
            material={{ color: '#24CAFF' }} />
        </Entity>
*/}
        <Entity events={{
          click: this.changeBulb.bind(this),
          fusing: this.fuse.bind(this)
        }}>
          <Entity gltf-model={this.state.bulb?"#on":"#off"}
            position={{ x: 0, y: 4, z: -3 }}
            scale={{ x: 0.25, y: 0.25, z: 0.25 }}

          />
          </Entity >
          {/* <Entity gltf-model={'#off'}  position={{ x: 2, y: 2, z: -3 }} scale={{x:0.25,y:0.25,z:0.25}}/>*/}
          <Entity primitive="a-camera"  camera={{userHeight: 1.6}}>
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

import 'aframe';
import 'babel-polyfill';
import { Entity, Scene } from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';
import Bulb from './components/Bulb';
import Box from './components/Box';
import Environment from './components/Environment';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: 'red',
      bulb: false
    };

  }
  daydreamClick(){
    alert('Hello world!');
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
       <VoiceRecognitionDemo/>
       <Environment/>
        <Bulb/>
        <a-entity laser-controls line="color: red; opacity: 1"></a-entity>
       
        <Entity primitive="a-camera" camera={{ userHeight: 1.6 }}>
          <a-entity cursor="fuse: false; fuseTimeout: 500"
          /*  position="0 0 -1"
            geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
    material="color: black; shader: flat">*/>
          </a-entity>
         
        
        </Entity>
      </Scene>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#sceneContainer'));

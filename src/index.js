import 'aframe'
import 'babel-polyfill'
import { Entity, Scene } from 'aframe-react'
import React from 'react'
import ReactDOM from 'react-dom'

import Environment from './components/Environment'
import Conditioner from './components/Conditioner'
import Tv from './components/Tv'
import Lamp from './components/Lamp'
import Camview from './components/Camview'
import 'aframe-teleport-controls'
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: 'red',
      bulb: false
    };

  }

  render() {
    return (


      <Scene stats>
        
        <a-assets>
          <img id="groundTexture" src="https://cdn.aframe.io/a-painter/images/floor.jpg" />
          <img id="skyTexture" src="https://cdn.aframe.io/a-painter/images/sky.jpg" />
          <a-asset-item id="off" src="/model/scene.gltf" />
          <a-asset-item id="on" src="/model/bulb_open.gltf" />
          <a-asset-item id="room" src="/model/labroom.gltf" />
          <a-asset-item id="box" src="/model/box.gltf" />

          <a-asset-item id="TV_ON" src="/model/TV_on.gltf" />
          <a-asset-item id="TV_OFF" src="/model/TV_off.gltf" />
          <a-asset-item id="CON_ON" src="/model/conditioner_on.gltf" />
          <a-asset-item id="CON_OFF" src="/model/conditioner_on.gltf" />
          <a-asset-item id="LIGHT_ON" src="/model/light_on.gltf" />
          <a-asset-item id="LIGHT_OFF" src="/model/light_off.gltf" />
        </a-assets>

<Entity daydream-controls="hand: right" laser-controls  line="color: red; opacity: 1"/>

      <Environment />
      <Conditioner x={3} y={0} z={0} id={"16"}/>
      <Conditioner x={3} y={0} z={9} id={"17"}/>   
      <Tv x={0} y={0} z={0}/> 
      <Lamp x={0} y={0} z={0} rotate={"80 0 0"} id={"13"}/>
      <Lamp x={0} y={0} z={9} rotate={"80 180 0"} id={"12"}/>    
      
       <Camview/>
      </Scene>

    );
  }
}

ReactDOM.render(<App />, document.querySelector('#sceneContainer'));

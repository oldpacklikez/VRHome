import 'aframe';

import {Entity} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';

class Box extends React.Component {
  render () {
    return (
      
        <Entity geometry={{primitive: 'box'}} material={{color: 'red'}} position={{x: 2, y: 0, z: -5}}/>
     
        
    );
  }
}


export default Box;

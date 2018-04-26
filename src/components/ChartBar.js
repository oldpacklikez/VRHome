import { Entity } from "aframe-react";
import React from "react";
const ChartBar = (pos,hi, value) => 
  <Entity
    geometry={{primitive:'box',height:pos.hi,width:0.25,depth:0.3,}}
    material={{color:"white"}}
    position={pos.pos}
  >

    <Entity
      text={{
        value: pos.value,
        color: "black",
        width: 4,
        align: "center"
      }}
      rotation="0 0 90"
      position="0 0 0.22"
    />
  </Entity>
;

export default ChartBar;
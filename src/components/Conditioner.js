import 'aframe'
import 'babel-polyfill'
import { Entity } from 'aframe-react'
import React from 'react'
import annyang from 'annyang'

class Conditioner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      con: false,
      visible: false,
      temp: 25,
      colordown: 'black',
      colorup: 'black'
    };
  }


  conSwitch() {
    this.setState({
      con: !this.state.con
    })

    this.reqCon("set_On_Off", this.state.con ? 1 : 0)
  }

  reqCon(cmd, value) {
    fetch('http://161.246.5.69/api/appliances/' + this.props.id + '/command/?format=json&username=test&api_key=576ce7157410fef051b42ed5ed393498dc58a1b5',
      {
        method: 'POST',
        headers: {
          'Authorization': 'key=AIzaSyCkjT4p2-OPguWztJUmXI8Iw3nxuaWCIFI',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify
          ({
            "cmd_name": cmd,
            "parameters":
              {
                "setTo": value
              }
          })
      })

    console.log("Call reqChannel")
  }
  colorSelect(state,side){
    if (state==="in")
    {
      
      side?this.setState({
        colorup:"red"
      })
      :
      this.setState({
        colordown:"red"
      })
    }
    else
    {
      side?this.setState({
        colorup:"black"
      })
      :
      this.setState({
        colordown:"black"
      })
    }
  }
  upTemp() {
    if (this.state.temp < 30)
      this.setState({
        temp: this.state.temp + 1
      })
    else
      this.setState({
        temp: 30
      })

    this.reqCon("set_temperature", this.state.temp)
  }

  downTemp() {
    console.log("hit")
    if (this.state.temp > 23)
      this.setState({
        temp: this.state.temp - 1
      })
    else
      this.setState({
        temp: 23
      })

    this.reqCon("set_temperature", this.state.temp)
  }
  //   componentDidMount(){
  //     console.log("hit in")
  //     this.interval = setInterval( ()=>
  //         fetch('http://161.246.5.69/api/appliances/'+this.props.id+'/info/?format=json&username=test&api_key=576ce7157410fef051b42ed5ed393498dc58a1b5')
  //         .then(response => response.json())
  //         .then(data => this.setState({ 
  //             con: data[0].value?true:false,
  //             temp: data[1].value,

  //          }))
  //         ,1000);
  // }
  render() {
    return (
      <Entity
      >
        {/* ON panel */}
        <Entity primitive="a-plane"
          height="0.42"
          rotation="0 -90 0"
          color={this.state.con ? 'black' : '#FF2E2E'}
          emissiveIntensity="0"
          events={{
            click: this.conSwitch.bind(this)
          }}
          position={{ x: this.props.x + 4.639, y: this.props.y + 4.706, z: this.props.z - 2.901 }}
        >
              {/* color Display */}
              <Entity primitive="a-plane"
                height="0.42"
                width="0.38"
                color={
                  this.state.con ? '#3D8129' : 'black'
                }
                emissiveIntensity={
                  "0"
                }
                position={{ x: 0.27, y: 0, z:  0.01 }} />


              <Entity

                text={{
                  value: this.state.con ? this.state.temp + ' °C' : 'OFF',
                  color: 'white',
                  width: 9,
                  align: 'center'
                }}
                position={{ x: 0, y: 0, z: 0.01 }} />


        </Entity>
        <Entity visible={this.state.con}>
          {/*Display temp*/}

          <Entity primitive="a-triangle"
            rotation="0 -90 -90"
            position={{ x: this.props.x +4.6, y: this.props.y+4.731, z: this.props.z-3.644 }}
            scale="0.32 0.32 0"
            vertexA="0 0.5 0"
            vertexB="-0.25 -0.25 0"
            vertexC="0.25 -0.25 0"
            color={this.state.colorup}
            events={{
              mouseenter: this.colorSelect.bind(this,'in',true),
              mouseleave: this.colorSelect.bind(this,'out',true),
              click: this.upTemp.bind(this)
            }}
          />

          <Entity primitive="a-triangle"
            rotation="0 -90 90"
            position={{ x: this.props.x +4.6, y: this.props.y+4.731, z: this.props.z-4.039 }}
            scale="0.32 0.32 0"
            vertexA="0 0.5 0"
            vertexB="-0.25 -0.25 0"
            vertexC="0.25 -0.25 0"
            color={this.state.colordown}
            events={{
              mouseenter: this.colorSelect.bind(this,'in',false),
              mouseleave: this.colorSelect.bind(this,'out',false),
              click: this.downTemp.bind(this)
            }}
          >
            <Entity primitive="a-triangle"
              position="0 -0.056 1000"
              scale="0.75 0.75 0.75"
              vertexA="0 0.5 0"
              vertexB="-0.5 -0.5 0"
              vertexC="0.5 -0.5 0"
              color="white"
            />
          </Entity>


        </Entity>


        {/* con model */}
        <Entity gltf-model={this.state.con ? "#CON_ON" : "#CON_OFF"}
          position={{ x: this.props.x, y: this.props.y, z: this.props.z }}
          scale={{ x: 2, y: 2, z: 2 }}
          />
      </Entity>
    );
  }
}


export default Conditioner;
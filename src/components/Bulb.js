import 'aframe'
import 'babel-polyfill'
import { Entity } from 'aframe-react'
import React from 'react'
import annyang from 'annyang'

class Bulb extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bulb: false,
      hello: false
    };
  }
  componentDidMount() {
    if (annyang) {
      // Let's define a command.
      var commands = {
        'turn on the light': () => this.setState({ bulb: !this.state.bulb }),
        'turn off the light': () => this.setState({ bulb: false })
      };

      // Add our commands to annyang
      annyang.addCommands(commands);

      //test
      annyang.addCallback('result', function(userSaid, commandText, phrases) {
        console.log(userSaid); // sample output: 'hello'
        console.log(commandText); // sample output: 'hello (there)'
        console.log(phrases); // sample output: ['hello', 'halo', 'yellow', 'polo', 'hello kitty']
      });
      // Start listening.
      annyang.start();
    }
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
      <Entity>
       
        {/* ON panel */}
        <Entity primitive="a-plane"
          height="1" width="1"
          rotation="0 -15 0"
          color={
            this.state.bulb ? 'green' : 'white'
          }
          position={{ x: 3, y: 4, z: -4 }}
          events={{
            click: this.bulbOn.bind(this)
          }}>
          <Entity text={{
            value: 'On',
            color: 'black',
            width: 4,
            align: 'center'
          }} />
        </Entity>

        {/* OFF panel */}
        <Entity primitive="a-plane"
          height="1"
          width="1"
          rotation="0 -15 0"
          color={
            this.state.bulb ? 'white' : 'red'
          }
          position={{ x: 4, y: 4, z: -3.7 }}
          events={{
            click: this.bulbOff.bind(this)
          }}>>
                                                        <Entity text={{
            value: 'Off',
            color: 'black',
            width: 4,
            align: 'center'
          }} />
        </Entity>

        {/* Bulb model */}
        <Entity gltf-model={this.state.bulb ? "#on" : "#off"}
          position={{ x: 0, y: 4, z: -3 }}
          scale={{ x: 0.25, y: 0.25, z: 0.25 }}
        />
      </Entity>
    );
  }
}


export default Bulb;
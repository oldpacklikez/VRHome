import 'aframe'
import 'babel-polyfill'
import { Entity } from 'aframe-react'
import React from 'react'


class Tv extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tv: false,
            vol: 50,
            channel: 0,
            visible: false,
           
        };
       
    }
  

 
    tvSwitch() {
        this.setState({
            tv: !this.state.tv
        })
        fetch('http://161.246.5.69/api/appliances/15/command/?format=json&username=test&api_key=576ce7157410fef051b42ed5ed393498dc58a1b5', {
                method: 'POST',
                headers: {
                    'Authorization': 'key=AIzaSyCkjT4p2-OPguWztJUmXI8Iw3nxuaWCIFI',
                    'Content-Type': 'application/json',
        },
                body: JSON.stringify({
                    "cmd_name": "set_On_Off",
                    "parameters":{
                        "setTo": this.state.tv?1:0
                    }
        })

    
        })


        

    }
    tvShow() {
        this.setState({
            visible: !this.state.visible
        })
    }

    reqChannel(cmd,value){
        fetch('http://161.246.5.69/api/appliances/15/command/?format=json&username=test&api_key=576ce7157410fef051b42ed5ed393498dc58a1b5', 
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
    upChannel() {
        if(this.state.channel<6)
        this.setState({
            channel: this.state.channel + 1
        })
        else
        this.setState({
            channel: 1
        })
        console.log("WTF")
        this.reqChannel("set_channel",this.state.channel)
    }
    downChannel() {
        if(this.state.channel>1)
        this.setState({
            channel: this.state.channel - 1
        })
        else
        this.setState({
            channel: 6
        })
        
        this.reqChannel("set_channel",this.state.channel)
    }

    upVol() {
        if(this.state.vol<100)
        this.setState({
            vol: this.state.vol + 1
        })
        else
        this.setState({
            vol: 0
        })

        this.reqChannel("set_volume",this.state.vol)
    }
    downVol() {
        if(this.state.vol>0)
        this.setState({
            vol: this.state.vol - 1
        })
        else
        this.setState({
            vol: 100
        })

        this.reqChannel("set_volume",this.state.vol)
    }
    // componentDidMount(){
    //     console.log("hit in")
    //     this.interval = setInterval( ()=>
    //         fetch('http://161.246.5.69/api/appliances/15/info/?format=json&username=test&api_key=576ce7157410fef051b42ed5ed393498dc58a1b5')
    //         .then(response => response.json())
    //         .then(data => this.setState({ 
    //             tv: data[0].value?true:false,
    //             vol: data[1].value,
    //             channel: data[2].value
    //          }))
    //         ,1000);
    // }
    
    render() {
      
       
           
        return (
            <Entity>
                {/* ON panel */}
                <Entity primitive="a-circle"

                    radius="0.5"
                    rotation="0 0 0"
                    color={
                        this.state.tv ? 'green' : 'red'
                    }
                    position={{ x: this.props.x + -5.2, y: this.props.y + 1.5, z: this.props.z - 6 }}
                    events={{
                        click: this.tvSwitch.bind(this)
                    }}

                >
                    <Entity text={{
                        value: this.state.tv ? 'On' : 'Off',
                        color: 'black',
                        width: 4,
                        align: 'center'
                    }} />
                </Entity>
                <Entity visible={this.state.tv}>


                    {/*TV*/}

                    {/*Display channel*/}
                    <Entity primitive="a-plane"
                        width="1.2"
                        color={'white'}
                        position={{ x: this.props.x -4.6, y: this.props.y + 2.8, z: this.props.z - 6.3 }}>
                         
                         <Entity text={{
                            value: "channel" ,
                            color: 'black',
                            width: 5,
                            align:"center",
                            
                        }}
                        position={{ x: this.props.x , y: this.props.y +0.28 , z: this.props.z  }}> >  
                        
                         <Entity text={{
                            value:  this.state.channel ,
                            color: 'black',
                            width: 12,
                            align:"center",
                        }}
                        position={{ x: this.props.x, y: this.props.y - 0.48, z: this.props.z }}
                        />
                        </Entity>
                        

                    </Entity>
                        {/*Display vol*/}
                     <Entity primitive="a-plane"
                        width="1.2"
                        color={'white'}
                        position={{ x: this.props.x -5.78, y: this.props.y + 2.8, z: this.props.z - 6.3 }}>
                         
                         <Entity text={{
                            value: "volume" ,
                            color: 'black',
                            width: 5,
                            align:"center",
                            
                        }}
                        position={{ x: this.props.x , y: this.props.y +0.28 , z: this.props.z  }}> >  
                        
                         <Entity text={{
                            value:  this.state.vol ,
                            color: 'black',
                            width: 12,
                            align:"center",
                        }}
                        position={{ x: this.props.x, y: this.props.y - 0.48, z: this.props.z }}
                        />
                        </Entity>
                        

                    </Entity>
                    
                        {/*Up channel*/}
                        <Entity primitive="a-circle"
                            radius="0.25"
                            color={'grey'}
                            position={{ x: -3.255, y: 2, z: -5.925 }}
                            events={{
                                click: this.upChannel.bind(this)
                            }}
                        >
                            <Entity text={{
                                value: '^',
                                color: 'black',
                                width: 16,
                                align: 'center'
                            }} 
                            position={{ x: -0.013, y: -0.102, z: 0 }}/>
                        </Entity>

                        {/*Down channel*/}
                        <Entity primitive="a-circle"
                            radius="0.25"
                            color={'grey'}
                            position={{ x: -3.255, y: 1.3, z: -5.925 }}
                            events={{
                                click: this.downChannel.bind(this)
                            }}

                        >
                            <Entity text={{
                                value: '^',
                                color: 'black',
                                width: 16,
                                align: 'center'
                            }} 
                            rotation="0 0 180"
                            position={{ x: -0.013, y: 0.102, z: 0 }}/>
                        </Entity>

                         {/*vol up*/}
                         <Entity primitive="a-circle"
                            radius="0.25"
                            color={'grey'}
                            position={{ x: -7.255, y: 2, z: -5.925 }}
                            events={{
                                click: this.upVol.bind(this)
                            }}

                        >
                            <Entity text={{
                                value: '+',
                                color: 'black',
                                width: 16,
                                align: 'center'
                            }} 
                            />
                        </Entity>

                        {/*vol down*/}
                        <Entity primitive="a-circle"
                            radius="0.25"
                            color={'grey'}
                            position={{ x: -7.255, y: 1.3, z: -5.925 }}
                            events={{
                                click: this.downVol.bind(this)
                            }}

                        >
                            <Entity text={{
                                value: '-',
                                color: 'black',
                                width: 16,
                                align: 'center'
                            }} 
                            
                           />
                        </Entity>
                       


                 



                </Entity>


                {/* tv model */}
                <Entity gltf-model={this.state.tv ? "#TV_ON" : "#TV_OFF"}
                    position={{ x: this.props.x, y: this.props.y, z: this.props.z }}
                    scale={{ x: 2, y: 2, z: 2 }}
                    events={{
                        click: this.tvShow.bind(this)
                    }}

                />
            </Entity>
        );
    }
}


export default Tv;
import 'aframe'
import 'babel-polyfill'
import { Entity } from 'aframe-react'
import React from 'react'
import annyang from 'annyang'

class Lamp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lamp: false,
            visible: false,
            bright: 50,
			color: '#FFF0FF',
            data: {
				app_id: 12
            },
            sum: [],
            dayCount: 0
        };
        this.reqLog.bind(this)
    }
    timeFormat(day) {
        let d = new Date()
        if (day != 0) {
            d.setDate(d.getDate() - day)
            d.setUTCHours(0, 0, 0)
        }
        return d.toISOString().split('.')[0]
    }
    reqLog(day) {
        var sum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        var temp
        return fetch('http://161.246.5.69/api/app_usage_log/?format=json&username=test&api_key=576ce7157410fef051b42ed5ed393498dc58a1b5&start_time=' + this.timeFormat(day) + '&end_time=' + this.timeFormat(0) + '&app_id=' + this.props.id)
            .then(response => response.json())
            .then(datar => {
                temp = datar.objects
                temp.forEach(element => {
                    let d = new Date(element.created_date)
                    sum[d.getDate()] = (sum[d.getDate()] + element.kWh)
                })
            })
            .then(() => {
                this.setState({
                    sum: sum,
                })
            })
    }

    reqLamp(cmd, value) {
        fetch('http://161.246.5.69/api/appliances/' + this.props.id + '/command/?format=json&username=test&api_key=576ce7157410fef051b42ed5ed393498dc58a1b5',
            {
                method: 'POST',
                headers: {
                    'Authorization': 'key=AIzaSyCkjT4p2-OPguWztJUmXI8Iw3nxuaWCIFI',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "cmd_name": cmd,
                    "parameters":
                        {
                            "setTo": value
                        }
                })
            })


    }
    lampON() {
        this.setState({
            lamp: true
        })
        this.reqLamp("set_On_Off", this.state.lamp)

    }
    lampOFF() {
        this.setState({
            lamp: false
        })
        this.reqLamp("set_On_Off", this.state.lamp)

    }
    brightToggle() {
        let n = this.state.bright
        if (n === 25)
            n = 50
        else if (n === 50)
            n = 75
        else if (n === 75)
            n = 100
        else
            n = 25

        this.setState({
            bright: n
        })
        this.reqLamp("set_brightness", this.state.bright)
        // console.log(n)
    }
    colorNormal() {
        let n = this.state.color
        this.setState({
            color: "#ffffff"
        })
        this.reqLamp("set_color", 16749353)
    }
    colorWarm() {
        let n = this.state.color
        this.setState({
            color: "#ff9329"
        })
        this.reqLamp("set_color", 4234495)
    }
    colorCool() {
        let n = this.state.color
        this.setState({
            color: "#409cff"
        })
        this.reqLamp("set_color", 16777215)
    }
    lampShow() {
        this.setState({
            visible: !this.state.visible
        })
    }
    upTemp() {
        this.setState({
            temp: this.state.temp + 1
        })

        this.reqLamp("set_temperature", this.state.temp)
    }
    downTemp() {
        this.setState({
            temp: this.state.temp - 1
        })

        this.reqLamp("set_temperature", this.state.temp)
    }

    componentDidMount() {
        var lampStatus,colorString,brightness
        // this.interval = setInterval(() =>
        fetch('http://161.246.5.69/api/appliances/' + this.props.id + '/info/?format=json&username=test&api_key=576ce7157410fef051b42ed5ed393498dc58a1b5')
            .then(response => response.json())
            .then(data => {
               
               
                 lampStatus = data[0].value ? true : false
                 colorString = "#" + (data[2].value).toString(16)
                 brightness = data[1].value
                
            }
            )
        // , 3000);
        this.setState({lamp: lampStatus,color: colorString,bright: brightness})
        this.reqLog(30)

    }
    render() {


        let { sum, dayCount } = this.state
        var dd = new Date()
        var day = dd.getDate() - 1 - dayCount

        console.log(this.state.sum)
        return (
            <Entity >
                <Entity primitive="a-plane"
                    position={{ x: this.props.x - 0.378, y: this.props.y + 5, z: this.props.z + -4.288 }}
                    rotation={this.props.rotate}
                    height="1.830"
                    width="3.380"
                    color={this.state.color}
                >
                    {/* ON panel */}
                    <Entity primitive="a-plane"
                        position={{ x: -0.72, y: 0.35, z: 0.1 }}
                        height="0.5"
                        width="1.5"
                        color={this.state.lamp ? "green" : "grey"}
                        events={{
                            click: this.lampON.bind(this)
                        }}>
                        <Entity text={{
                            value: 'On',
                            color: 'white',
                            width: 4,
                            align: 'center'
                        }}
                        />
                    </Entity>
                    {/* OFF panel */}
                    <Entity primitive="a-plane"
                        position={{ x: 0.78, y: 0.35, z: 0.1 }}
                        height="0.5"
                        width="1.5"
                        color={this.state.lamp ? "grey" : "red"}
                        events={{
                            click: this.lampOFF.bind(this)
                        }} >
                        <Entity text={{
                            value: 'Off',
                            color: 'white',
                            width: 4,
                            align: 'center'
                        }}
                        />
                    </Entity>
                    {/* Normal color light */}
                    <Entity primitive="a-plane"
                        position={{ x: -1.2, y: -0.3, z: 0.1 }}
                        height="0.5"
                        width="0.5"
                        color="#ffffff"
                        events={{
                            click: this.colorNormal.bind(this)
                        }} >
                        <Entity text={{
                            value: 'N',
                            color: 'white',
                            width: 4,
                            align: 'center'
                        }} />
                    </Entity>
                    {/* Warm color light */}
                    <Entity primitive="a-plane"
                        position={{ x: -0.7, y: -0.3, z: 0.1 }}
                        height="0.5"
                        width="0.5"
                        color="#ff9329"
                        events={{
                            click: this.colorWarm.bind(this)
                        }} >
                        <Entity text={{
                            value: 'W',
                            color: 'white',
                            width: 4,
                            align: 'center'
                        }} />
                    </Entity>
                    {/* Cool color light */}
                    <Entity primitive="a-plane"
                        position={{ x: -0.2, y: -0.3, z: 0.1 }}
                        height="0.5"
                        width="0.5"
                        color="#409cff"
                        events={{
                            click: this.colorCool.bind(this)
                        }} >
                        <Entity text={{
                            value: 'C',
                            color: 'white',
                            width: 4,
                            align: 'center'
                        }} />
                    </Entity>
                    {/* Brightness control */}
                    <Entity primitive="a-plane"
                        position={{ x: 1, y: -0.3, z: 0.1 }}
                        height="0.5"
                        width="1"
                        color="black"
                        events={{
                            click: this.brightToggle.bind(this)
                        }}>
                        <Entity text={{
                            value: this.state.bright,
                            color: 'white',
                            width: 4,
                            align: 'center'
                        }} />
                    </Entity>
                    {/* Graph */}
                    <Entity primitive="a-plane"
                        position={{ x: -0.137, y: -1.152, z: 1.153 }}
                        rotation="-50 0 -90"
                        height="1.5"
                        width="3"
                        color="black"
                        events={{
                            click: this.brightToggle.bind(this)
                        }}>
                        {/* day chart */}
                        {/* 1 */}
                        <Entity primitive="a-box"
                            position={{ x: -1.2, y: 0, z: 0.153 }}
                            height={0.5 + sum[day - 6] / 100}
                            width="0.25"
                            depth="0.3"
                            color="white"
                        >
                            <Entity text={{
                                value: Math.round(sum[day - 6]),
                                color: 'black',
                                width: 4,
                                align: 'center'

                            }}
                                rotation='0 0 90'
                                position='0 0 0.22' />
                        </Entity>
                        {/* 2 */}
                        <Entity primitive="a-box"
                            position={{ x: -0.8, y: 0, z: 0.153 }}
                            height={0.5 + sum[day - 5] / 100}
                            width="0.25"
                            depth="0.3"
                            color="white"
                        >
                            <Entity text={{
                                value: Math.round(sum[day - 5]),
                                color: 'black',
                                width: 4,
                                align: 'center'

                            }}
                                position='0 0 0.22'
                                rotation='0 0 90' />
                        </Entity>
                        {/* 3 */}
                        <Entity primitive="a-box"
                            position={{ x: -0.4, y: 0, z: 0.153 }}
                            height={0.5 + sum[day - 4] / 100}
                            width="0.25"
                            depth="0.3"
                            color="white"
                        >
                            <Entity text={{
                                value: Math.round(sum[day - 4]),
                                color: 'black',
                                width: 4,
                                align: 'center'

                            }}
                                position='0 0 0.22'
                                rotation='0 0 90' />
                        </Entity>
                        {/* 4 */}
                        <Entity primitive="a-box"
                            position={{ x: 0, y: 0, z: 0.153 }}
                            height={0.5 + sum[day - 3] / 100}
                            width="0.25"
                            depth="0.3"
                            color="white"
                        >
                            <Entity text={{
                                value: Math.round(sum[day - 3]),
                                color: 'black',
                                width: 4,
                                align: 'center'

                            }}
                                position='0 0 0.22'
                                rotation='0 0 90' />
                        </Entity>
                        {/* 5 */}
                        <Entity primitive="a-box"
                            position={{ x: 0.4, y: 0, z: 0.153 }}
                            height={0.5 + sum[day - 2] / 100}
                            width="0.25"
                            depth="0.3"
                            color="white"
                        >
                            <Entity text={{
                                value: Math.round(sum[day - 2]),
                                color: 'black',
                                width: 4,
                                align: 'center'

                            }}
                                position='0 0 0.22'
                                rotation='0 0 90' />
                        </Entity>
                        {/* 6 */}
                        <Entity primitive="a-box"
                            position={{ x: 0.8, y: 0, z: 0.153 }}
                            height={0.5 + sum[day - 1] / 100}
                            width="0.25"
                            depth="0.3"
                            color="white"
                        >
                            <Entity text={{
                                value: Math.round(sum[day - 1]),
                                color: 'black',
                                width: 4,
                                align: 'center'

                            }}
                                position='0 0 0.22'
                                rotation='0 0 90' />
                        </Entity>
                        {/* 7 */}
                        <Entity primitive="a-box"
                            position={{ x: 1.2, y: 0, z: 0.153 }}
                            height={0.5 + sum[day] / 100}
                            width="0.25"
                            depth="0.3"
                            color="white"
                        >
                            <Entity text={{
                                value: Math.round(sum[day]),
                                color: 'black',
                                width: 4,
                                align: 'center'

                            }}
                                position='0 0 0.22'
                                rotation='0 0 90' />
                        </Entity>

                    </Entity>

                </Entity>




                {/* lamp model */}
                <Entity gltf-model={this.state.lamp ? "#LIGHT_ON" : "#LIGHT_OFF"}
                    position={{ x: this.props.x - 3.642, y: this.props.y, z: this.props.z - 0.775 }}
                    scale={{ x: 2, y: 2, z: 2 }}
                    events={{
                        click: this.lampShow.bind(this)
                    }}
                />

            </Entity>
        );
    }
}


export default Lamp;
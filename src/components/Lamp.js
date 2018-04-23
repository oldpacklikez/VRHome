import "aframe";
import "babel-polyfill";
import { Entity } from "aframe-react";
import React from "react";
import { Provider, Consumer } from "../statemanager/Store";

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

class Lamp extends React.Component {
  state = {
    lamp: false,
    visible: false,
    bright: 25,
    color: "#FFF0FF",
    app_id: this.props.id,
    sum: []
  };

  timeFormat(day) {
    let d = new Date();
    if (day != 0) {
      d.setDate(d.getDate() - day);
      d.setUTCHours(0, 0, 0);
    }
    return d.toISOString().split(".")[0];
  }
  reqLog(day) {
    var sum = new Array(30).fill(0);
    var temp;
    return fetch(
      "http://161.246.5.69/api/app_usage_log/?format=json&username=test&api_key=576ce7157410fef051b42ed5ed393498dc58a1b5&start_time=" +
        this.timeFormat(day) +
        "&end_time=" +
        this.timeFormat(0) +
        "&app_id=" +
        this.props.id
    )
      .then((response) => response.json())
      .then((data) => {
        temp = data.objects;
        temp.forEach((item) => {
          let n = new Date(item.created_date).getDate();
          sum[n] = (sum[n] ? sum[n] : 0) + item.kWh;
        });
       
      })
      .then(
        this.setState((prevState) => ({
          ...prevState,
          sum: sum
        }))
      );
  }
  reqLamp(cmd, value) {
    fetch(
      "http://161.246.5.69/api/appliances/" +
        this.props.id +
        "/command/?format=json&username=test&api_key=576ce7157410fef051b42ed5ed393498dc58a1b5",
      {
        method: "POST",
        headers: {
          Authorization: "key=AIzaSyCkjT4p2-OPguWztJUmXI8Iw3nxuaWCIFI",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cmd_name: cmd,
          parameters: {
            setTo: value
          }
        })
      }
    );
  }
  lampControl(cmd) {
    this.setState((prevState) => ({
      ...prevState,
      lamp: cmd
    }));
    this.reqLamp("set_On_Off", this.state.lamp ? 1 : 0);
  }

  brightToggle() {
    let { bright } = this.state;
    if (bright === 25) bright = 50;
    else if (bright === 50) bright = 75;
    else if (bright === 75) bright = 100;
    else bright = 25;

    this.setState((prevState) => ({
      ...prevState,
      bright: bright
    }));
    this.reqLamp("set_brightness", this.state.bright);
  }
  colorLamp(index) {
    let color = [
      {
        nameColor: "Normal",
        textColor: "#ffffff",
        codeColor: 16749353
      },
      {
        nameColor: "Warm",
        textColor: "#ff9329",
        codeColor: 4234495
      },
      {
        nameColor: "Cool",
        textColor: "#409cff",
        codeColor: 16777215
      }
    ];
    this.setState((prevState) => ({
      ...prevState,
      color: [color[index].textColor]
    }));

    this.reqLamp("set_color", color[index].codeColor);
  }

  lampShow() {
    this.setState((prevState) => ({
      ...prevState,
      visible: !prevState.visible
    }));
  }

  componentDidMount() {
    var lampStatus, colorString, brightness;
    // this.interval = setInterval(() =>
    fetch(
      "http://161.246.5.69/api/appliances/" +
        this.props.id +
        "/info/?format=json&username=test&api_key=576ce7157410fef051b42ed5ed393498dc58a1b5"
    )
      .then((response) => response.json())
      .then((data) => {
        lampStatus = data[0].value ? true : false;
        colorString = "#" + data[2].value.toString(16);
        brightness = data[1].value;
      })
      .then(
        this.setState((prevState) => ({
          ...prevState,
          lamp: lampStatus ? lampStatus : false,
          color: colorString ? colorString : "white",
          bright: brightness ? brightness : 25
        }))
      );
    // , 3000);

    this.reqLog(30);
  }
  render() {
    let { visible } = this.state;
    let { sum } = this.state;
    let date = new Date();
    let day = date.getDate();
    let maxDay = new Date(date.getMonth, date.getFullYear, 0);
    const { app_id } = this.state;
    let high = [];
    for (let i = 0; i <= 6; i++) {
      if (day - i >= 0) high.push(sum[day - i] / 100);
      else high.push(sum[day - i + maxDay] / 100);
    }

    let max = Math.max(...high);
    return (
      <Entity
        position={{ x: this.props.x, y: this.props.y, z: this.props.z }}
        rotation={this.props.rotate}
      >
        <Consumer>
          {(context) => (
            <React.Fragment>
              <Entity
                primitive="a-plane"
                position={{ x: -0.5, y: 3.7, z: -2 }}
                height="1.830"
                width="3.380"
                visible={visible}
                color={this.state.color}
                opacity="0.5"
              >
                {/* ON panel */}

                <Entity
                  primitive="a-plane"
                  position={{ x: -0.72, y: 0.35, z: 0.1 }}
                  height="0.5"
                  width="1.5"
                  color={this.state.lamp ? "green" : "#3a556d"}
                  events={{
                    click: () => {
                      this.lampControl(true);
                      context.setLamp(
                        app_id,
                        this.state.lamp,
                        this.state.color,
                        this.state.bright
                      );
                    }
                  }}
                >
                  <Entity
                    text={{
                      value: "ON",
                      color: "white",
                      width: 4,
                      align: "center"
                    }}
                  />
                </Entity>

                {/* OFF panel */}
                <Entity
                  primitive="a-plane"
                  position={{ x: 0.78, y: 0.35, z: 0.1 }}
                  height="0.5"
                  width="1.5"
                  color={this.state.lamp ? "#3a556d" : "red"}
                  events={{
                    click: () => {
                      this.lampControl(false);
                      context.setLamp(app_id, this.state.lamp, "white", 25);
                    }
                  }}
                >
                  <Entity
                    text={{
                      value: "OFF",
                      color: "white",
                      width: 4,
                      align: "center"
                    }}
                  />
                </Entity>
                {/* Normal color light */}
                <Entity
                  primitive="a-plane"
                  position={{ x: -1.2, y: -0.3, z: 0.1 }}
                  height="0.5"
                  width="0.5"
                  color="#ffffff"
                  events={{
                    click: () => (
                      this.colorLamp(0),
                      context.setLamp(
                        app_id,
                        this.state.lamp,
                        this.state.color,
                        this.state.bright
                      )
                    )
                  }}
                >
                  <Entity
                    text={{
                      value: "N",
                      color: "black",
                      width: 4,
                      align: "center"
                    }}
                  />
                </Entity>
                {/* Warm color light */}
                <Entity
                  primitive="a-plane"
                  position={{ x: -0.7, y: -0.3, z: 0.1 }}
                  height="0.5"
                  width="0.5"
                  color="#ff9329"
                  events={{
                    click: () => (
                      this.colorLamp(1),
                      context.setLamp(
                        app_id,
                        this.state.lamp,
                        this.state.color,
                        this.state.bright
                      )
                    )
                  }}
                >
                  <Entity
                    text={{
                      value: "W",
                      color: "black",
                      width: 4,
                      align: "center"
                    }}
                  />
                </Entity>
                {/* Cool color light */}
                <Entity
                  primitive="a-plane"
                  position={{ x: -0.2, y: -0.3, z: 0.1 }}
                  height="0.5"
                  width="0.5"
                  color="#409cff"
                  events={{
                    click: () => (
                      this.colorLamp(2),
                      context.setLamp(
                        app_id,
                        this.state.lamp,
                        this.state.color,
                        this.state.bright
                      )
                    )
                  }}
                >
                  <Entity
                    text={{
                      value: "C",
                      color: "black",
                      width: 4,
                      align: "center"
                    }}
                  />
                </Entity>
                {/* Brightness control */}
                <Entity
                  primitive="a-plane"
                  position={{ x: 1, y: -0.3, z: 0.1 }}
                  height="0.5"
                  width="1"
                  color="black"
                  events={{
                    click: () => (
                      this.brightToggle(),
                      context.setLamp(
                        app_id,
                        this.state.lamp,
                        this.state.color,
                        this.state.bright
                      )
                    )
                  }}
                >
                  <Entity
                    text={{
                      value: this.state.bright,
                      color: "white",
                      width: 4,
                      align: "center"
                    }}
                  />
                </Entity>
                {/* Graph */}
                <Entity
                  primitive="a-plane"
                  position={{ x: -0.07, y: -1.9, z: 0.858 }}
                  rotation="0 0 0"
                  height="1.5"
                  width="3"
                  color="black"
                  opacity="0"
                  visible={this.state.lamp}
                >
                <Entity
                  primitive="a-plane"
                  position={{ x: 0.039, y: -0.86, z: 0.039 }}
                  rotation="-90 0 0"
                  height="1.5"
                  width="3"
                  color="black"
                  opacity="0.5"
                  events={{
                    click: () => {}
                  }}
                />
                  {/* day chart */}
                  {/* 1 */}
                  <ChartBar
                    pos={{ x: -1.2, y: (high[6] - max) / 2, z: 0.153 }}
                    hi={0.5+high[6]}
                    value={Math.round(sum[day - 6])}
                  />
                  {/* 2 */}
                  <ChartBar
                    pos={{ x: -0.8, y: (high[5] - max) / 2, z: 0.153 }} 
                    hi={0.5+high[5]}
                    value={Math.round(sum[day - 5])}
                  />
                 
                  {/* 3 */}
                  <ChartBar
                    pos={{ x: -0.4, y: (high[4] - max) / 2, z: 0.153 }}
                    hi={0.5+high[4]}
                    value={Math.round(sum[day - 4])}
                  />
               
                  {/* 4 */}
                  <ChartBar
                    pos={{ x: 0, y: (high[3] - max) / 2, z: 0.153 }}
                    hi={0.5+high[3]}
                    value={Math.round(sum[day - 3])}
                  />
                  
                  {/* 5 */}
                  <ChartBar
                    pos={{ x: 0.4, y: (high[2] - max) / 2, z: 0.153 }}
                    hi={0.5+high[2]}
                    value={Math.round(sum[day - 2])}
                  />
                
                  {/* 6 */}
                  <ChartBar
                    pos={{ x: 0.8, y: (high[1] - max) / 2, z: 0.153 }}
                    hi={0.5+high[1]}
                    value={Math.round(sum[day - 1])}
                  />
                  {/* 7 */}
                  <ChartBar
                    pos={{ x: 1.2, y: (high[0] - max) / 2, z: 0.153 }}
                    hi={0.5+high[0]}
                    value={Math.round(sum[day - 0])}
                  />
                  
                </Entity>
              </Entity>
              {/* lamp model */}
              <Entity
                gltf-model={this.state.lamp ? "#LIGHT_ON" : "#LIGHT_OFF"}
                position={{ x: -3.642, y: 0, z: 0 + 5 }}
                scale={{ x: 2, y: 2, z: 2 }}
                events={{
                  click: this.lampShow.bind(this),
                  mouseenter: context.mouseIN,
                  mouseleave: context.mouseOUT
                }}
              />
            </React.Fragment>
          )}
        </Consumer>
      </Entity>
    );
  }
}

export default Lamp;

import "aframe";
import { Entity } from "aframe-react";
import React from "react";
import ChartBar from "./ChartBar";
import 'babel-polyfill';
class Conditioner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      con: false,
      visible: false,
      temp: 25,
      colordown: "black",
      colorup: "black",
      sum: new Array(31).fill(0)
    };
  }

  conSwitch() {
    this.setState({
      con: !this.state.con
    });

    this.reqCon("set_On_Off", this.state.con ? 1 : 0);
  }
  timeFormat(day) {
    let d = new Date();
    if (day !== 0) {
      d.setDate(d.getDate() - day);
      d.setUTCHours(0, 0, 0);
    }
    return d.toISOString().split(".")[0];
  }
  reqLog(day) {
    var sum = new Array(31).fill(0);
    var temp;
    fetch(
      "http://" +
        this.props.endPoint +
        "/api/app_usage_log/?format=json&username=test&api_key=576ce7157410fef051b42ed5ed393498dc58a1b5&start_time=" +
        this.timeFormat(day) +
        "&end_time=" +
        this.timeFormat(0) +
        "&app_id=" +
        this.props.id
    )
      .then((response) => response.json())
      .then((data) => {
        temp = data.objects
        temp.forEach((item) => {
          let n = new Date(item.created_date).getDate();
          sum[n] = (sum[n] ? sum[n] : 0) + item.kWh;
        });
     
        this.setState({
          sum: sum
        });
      });
  }
  reqCon(cmd, value) {
    fetch(
      "http://" +
        this.props.endPoint +
        "/api/appliances/" +
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
    this.reqConInfo();
  }
  colorSelect(state, side) {
    if (state === "in") {
      side
        ? this.setState({
            colorup: "red"
          })
        : this.setState({
            colordown: "red"
          });
    } else {
      this.setState({
        colorup: "black",
        colordown: "black"
      });
    }
  }
  upTemp() {
    if (this.state.temp < 30)
      this.setState({
        temp: this.state.temp + 1
      });
    else
      this.setState({
        temp: 30
      });

    this.reqCon("set_temperature", this.state.temp);
  }

  downTemp() {
    if (this.state.temp > 23)
      this.setState({
        temp: this.state.temp - 1
      });
    else
      this.setState({
        temp: 23
      });

    this.reqCon("set_temperature", this.state.temp);
  }
  reqConInfo() {
    fetch(
      "http://" +
        this.props.endPoint +
        "/api/appliances/" +
        this.props.id +
        "/info/?format=json&username=test&api_key=576ce7157410fef051b42ed5ed393498dc58a1b5"
    )
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          con: data[0].value === 1 ? true : false,
          temp: data[1].value
        })
      );
  }
  componentDidMount() {
    this.reqConInfo();
    this.reqLog(7);
  }
  render() {
    let { sum } = this.state;
    let date = new Date();
    let day = date.getDate();
    let maxDay = new Date(date.getMonth, date.getFullYear, 0);

    let high = new Array(7).fill(0);

    for (let i = 0; i <= 6; i++) {
      if (day - i >= 0) high[i] = sum[day - i] / 100;
      else high[i] = sum[day - i + maxDay] / 100;
    }
    let max = Math.max(...high);

    max = max === 0 ? 1.2 : max;

    return (
      <Entity>
        {/* ON panel */}
        <Entity
          primitive="a-plane"
          height="0.42"
          rotation="0 -90 0"
          color={this.state.con ? "black" : "#FF2E2E"}
          emissiveIntensity="0"
          events={{
            click: this.conSwitch.bind(this)
          }}
          position={{
            x: this.props.x + 4.639,
            y: this.props.y + 4.706,
            z: this.props.z - 2.901
          }}
        >
          {/* color Display */}
          <Entity
            primitive="a-plane"
            height="0.42"
            width="0.38"
            color={this.state.con ? "#3D8129" : "black"}
            emissiveIntensity={"0"}
            position={{ x: 0.27, y: 0, z: 0.01 }}
          />

          <Entity
            text={{
              value: this.state.con ? this.state.temp + " °C" : "OFF",
              color: "white",
              width: 9,
              align: "center"
            }}
            position={{ x: 0, y: 0, z: 0.01 }}
          />
        </Entity>
        <Entity visible={this.state.con}>
          {/*Display temp*/}

          <Entity
            primitive="a-triangle"
            rotation="0 -90 -90"
            position={{
              x: this.props.x + 4.6,
              y: this.props.y + 4.731,
              z: this.props.z - 3.644
            }}
            scale="0.32 0.32 0"
            vertexA="0 0.5 0"
            vertexB="-0.25 -0.25 0"
            vertexC="0.25 -0.25 0"
            color={this.state.colorup}
            events={{
              mouseenter: this.colorSelect.bind(this, "in", true),
              mouseleave: this.colorSelect.bind(this, "out", true),
              click: this.upTemp.bind(this)
            }}
          />

          <Entity
            primitive="a-triangle"
            rotation="0 -90 90"
            position={{
              x: this.props.x + 4.6,
              y: this.props.y + 4.731,
              z: this.props.z - 4.039
            }}
            scale="0.32 0.32 0"
            vertexA="0 0.5 0"
            vertexB="-0.25 -0.25 0"
            vertexC="0.25 -0.25 0"
            color={this.state.colordown}
            events={{
              mouseenter: this.colorSelect.bind(this, "in", false),
              mouseleave: this.colorSelect.bind(this, "out", false),
              click: this.downTemp.bind(this)
            }}
          >
            <Entity
              primitive="a-triangle"
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
        <Entity



          gltf-model={ "#CON_ON" }
          position={{ x: this.props.x, y: this.props.y, z: this.props.z }}
          scale={{ x: 2, y: 2, z: 2 }}
        >
          {/* Graph */}
          <Entity
            primitive="a-plane"
            position={{ x: 2, y: 1, z: -2.234 }}
            rotation="0 -90 0"
            height="1.5"
            width="3"
            color="black"
            scale="0.5 0.5 0.5"
            opacity="0"
            visible={this.state.con}
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
              hi={0.5 + high[6]}
              value={Math.round(sum[day - 6])}
            />
            {/* 2 */}
            <ChartBar
              pos={{ x: -0.8, y: (high[5] - max) / 2, z: 0.153 }}
              hi={0.5 + high[5]}
              value={Math.round(sum[day - 5])}
            />

            {/* 3 */}
            <ChartBar
              pos={{ x: -0.4, y: (high[4] - max) / 2, z: 0.153 }}
              hi={0.5 + high[4]}
              value={Math.round(sum[day - 4])}
            />

            {/* 4 */}
            <ChartBar
              pos={{ x: 0, y: (high[3] - max) / 2, z: 0.153 }}
              hi={0.5 + high[3]}
              value={Math.round(sum[day - 3])}
            />

            {/* 5 */}
            <ChartBar
              pos={{ x: 0.4, y: (high[2] - max) / 2, z: 0.153 }}
              hi={0.5 + high[2]}
              value={Math.round(sum[day - 2])}
            />

            {/* 6 */}
            <ChartBar
              pos={{ x: 0.8, y: (high[1] - max) / 2, z: 0.153 }}
              hi={0.5 + high[1]}
              value={Math.round(sum[day - 1])}
            />
            {/* 7 */}
            <ChartBar
              pos={{ x: 1.2, y: (high[0] - max) / 2, z: 0.153 }}
              hi={0.5 + high[0]}
              value={Math.round(sum[day - 0])}
            />
          </Entity>
        </Entity>
      </Entity>
    );
  }
}

export default Conditioner;

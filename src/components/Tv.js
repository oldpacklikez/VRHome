import "aframe";
import "babel-polyfill";
import { Entity } from "aframe-react";
import React from "react";
import ChartBar from "./ChartBar";
class Tv extends React.Component {
  state = {
    tv: false,
    vol: 50,
    channel: 0,
    sum:new Array(31).fill(0)
  };
 
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
    setInterval(
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
      .then((response) => {
        response.json();
      })
      .then((data) => {console.log(data)
        if(data)
          {
            temp = data.objects;
          temp.forEach((item) => {
            let n = new Date(item.created_date).getDate();
            sum[n] = (sum[n] ? sum[n] : 0) + item.kWh;
          });
          this.setState({
            sum: sum
          });
      }
      }),5000)
  }
  tvSwitch() {
    this.setState(
      { tv: this.state.tv ? false : true },
      this.reqChannel("set_On_Off", this.state.tv ? 1 : 0)
    );
  }

  reqChannel(cmd, value) {
    fetch(
      "http://" +
        this.props.endPoint +
        "/api/appliances/15/command/?format=json&username=test&api_key=576ce7157410fef051b42ed5ed393498dc58a1b5",
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
  upChannel() {
    if (this.state.channel < 6)
      this.setState({
        channel: this.state.channel + 1
      });
    else
      this.setState({
        channel: 1
      });
    console.log("WTF");
    this.reqChannel("set_channel", this.state.channel);
  }
  downChannel() {
    if (this.state.channel > 1)
      this.setState({
        channel: this.state.channel - 1
      });
    else
      this.setState({
        channel: 6
      });

    this.reqChannel("set_channel", this.state.channel);
  }

  upVol() {
    if (this.state.vol < 100)
      this.setState({
        vol: this.state.vol + 1
      });
    else
      this.setState({
        vol: 0
      });

    this.reqChannel("set_volume", this.state.vol);
  }
  downVol() {
    if (this.state.vol > 0)
      this.setState({
        vol: this.state.vol - 1
      });
    else
      this.setState({
        vol: 100
      });

    this.reqChannel("set_volume", this.state.vol);
  }
  reqTVinfo() {
    fetch(
      "http://" +
        this.props.endPoint +
        "/api/appliances/15/info/?format=json&username=test&api_key=576ce7157410fef051b42ed5ed393498dc58a1b5"
    )
      .then((response) => response.json())
      .then((data) => {
        try {
          this.setState({
            tv: [data[0].value === 1 ? true : false],
            vol: [data[1].value],
            channel: [data[2].value]
          });
        } catch (err) {
          console.log("Tv error", err);
        }
      });
  }
  componentWillMount(){
    this.reqLog(7);
  }
  componentDidMount() {
    this.reqTVinfo();
   
  }

  render() {
    let sum = this.state.sum
    let date = new Date();
    let day = date.getDate();
    let maxDay = new Date(date.getMonth, date.getFullYear, 0);

    let high = new Array(7).fill(0);
    for (let i = 0; i < 7; i++) {
      if (day - i >= 0) high[i] = sum[day - i] / 100;
      else high[i] = sum[day - i + maxDay] / 100;
    }
    let max = Math.max(...high);
    max = max === 0 ? 1.2 : max;
    console.log("hi", high, "max", max, "sum", sum);
    return (
      <Entity>
        {/* ON panel */}
        <Entity
          primitive="a-plane"
          radius="0.5"
          rotation="0 0 0"
          opacity="0.5"
          color={this.state.tv ? "green" : "red"}
          position={{
            x: this.props.x - 5.2,
            y: this.props.y + 1.5,
            z: this.props.z - 6
          }}
          events={{
            click: this.tvSwitch.bind(this)
          }}
        >
          <Entity
            text={{
              value: this.state.tv ? "ON" : "OFF",
              color: "black",
              width: 4,
              align: "center"
            }}
          />
        </Entity>
        <Entity visible={this.state.tv}>
          {/*TV*/}

          {/*Display channel*/}
          <Entity
            primitive="a-plane"
            width="1.2"
            color={"white"}
            opacity="0.5"
            position={{
              x: this.props.x - 4.6,
              y: this.props.y + 2.8,
              z: this.props.z - 6.3
            }}
          >
            <Entity
              text={{
                value: "channel",
                color: "black",
                width: 5,
                align: "center"
              }}
              position={{
                x: this.props.x,
                y: this.props.y + 0.28,
                z: this.props.z
              }}
            >
              {" "}
              >
              <Entity
                text={{
                  value: this.state.channel,
                  color: "black",
                  width: 12,
                  align: "center"
                }}
                position={{
                  x: this.props.x,
                  y: this.props.y - 0.48,
                  z: this.props.z
                }}
              />
            </Entity>
          </Entity>
          {/*Display vol*/}
          <Entity
            primitive="a-plane"
            width="1.2"
            color={"white"}
            opacity="0.5"
            position={{
              x: this.props.x - 5.78,
              y: this.props.y + 2.8,
              z: this.props.z - 6.3
            }}
          >
            <Entity
              text={{
                value: "volume",
                color: "black",
                width: 5,
                align: "center"
              }}
              position={{
                x: this.props.x,
                y: this.props.y + 0.28,
                z: this.props.z
              }}
            >
              {" "}
              >
              <Entity
                text={{
                  value: this.state.vol,
                  color: "black",
                  width: 12,
                  align: "center"
                }}
                position={{
                  x: this.props.x,
                  y: this.props.y - 0.48,
                  z: this.props.z
                }}
              />
            </Entity>
          </Entity>

          {/*Up channel*/}
          <Entity
            primitive="a-circle"
            radius="0.25"
            color={"grey"}
            position={{ x: -3.255, y: 2, z: -5.925 }}
            opacity="0.5"
            events={{
              click: this.upChannel.bind(this)
            }}
          >
            <Entity
              text={{
                value: "^",
                color: "black",
                width: 16,
                align: "center"
              }}
              position={{ x: -0.013, y: -0.102, z: 0 }}
            />
          </Entity>

          {/*Down channel*/}
          <Entity
            primitive="a-circle"
            radius="0.25"
            color={"grey"}
            opacity="0.5"
            position={{ x: -3.255, y: 1.3, z: -5.925 }}
            events={{
              click: this.downChannel.bind(this)
            }}
          >
            <Entity
              text={{
                value: "^",
                color: "black",
                width: 16,
                align: "center"
              }}
              rotation="0 0 180"
              position={{ x: -0.013, y: 0.102, z: 0 }}
            />
          </Entity>

          {/*vol up*/}
          <Entity
            primitive="a-circle"
            radius="0.25"
            color={"grey"}
            opacity="0.5"
            position={{ x: -7.255, y: 2, z: -5.925 }}
            events={{
              click: this.upVol.bind(this)
            }}
          >
            <Entity
              text={{
                value: "+",
                color: "black",
                width: 16,
                align: "center"
              }}
            />
          </Entity>

          {/*vol down*/}
          <Entity
            primitive="a-circle"
            radius="0.25"
            color={"grey"}
            opacity="0.5"
            position={{ x: -7.255, y: 1.3, z: -5.925 }}
            events={{
              click: this.downVol.bind(this)
            }}
          >
            <Entity
              text={{
                value: "-",
                color: "black",
                width: 16,
                align: "center"
              }}
            />
          </Entity>
        </Entity>
        <Entity
          primitive="a-plane"
          position={{
            x: this.props.x - 5,
            y: this.props.y + 0.535,
            z: this.props.z - 3.758
          }}
          rotation="0 0 0"
          height="1.5"
          width="3"
          color="black"
          opacity="0"
          visible={this.state.tv}
          scale="0.5 0.5 0.5"
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
        {/* tv model */}
        <Entity
          gltf-model={this.state.tv ? "#TV_ON" : "#TV_OFF"}
          position={{ x: this.props.x, y: this.props.y, z: this.props.z }}
          scale={{ x: 2, y: 2, z: 2 }}
        />
      </Entity>
    );
  }
}

export default Tv;

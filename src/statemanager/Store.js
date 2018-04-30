import React from "react";

const Store = React.createContext();

export const Consumer = Store.Consumer;

export class Provider extends React.Component {
  state = {
    hover: false,
    light: {
      "12": {
        state: null,
        color: "white",
        bright: 15
      },
      "13": {
        state: null,
        color: "white",
        bright: 15
      }
    }
  };

  regLampInfo(id) {
    var lampStatus, colorString, brightness;
    fetch(
      "http://161.246.5.69/api/appliances/" +
        id +
        "/info/?format=json&username=test&api_key=576ce7157410fef051b42ed5ed393498dc58a1b5"
    )
      .then((response) => response.json())
      .then((data) => {
        lampStatus = data[0].value === 1 ? true : false;
        colorString = "#" + data[2].value.toString(16);
        brightness = data[1].value;
        console.log(
          "lampStatus ",
          lampStatus,
          "colorString",
          colorString,
          "brightness",
          brightness
        );
        this.setState((prevState) => ({
          light: {
            ...prevState.light,
            [id]: {
              state: lampStatus,
              color: colorString,
              bright: brightness
            }
          }
        }));
      });
  }
  componentWillUpdate(nextState) {
    console.log(nextState);
  }
  shouldComponentUpdate(prevState, nextState) {
    console.log(nextState);
    return !Object.is(prevState, nextState);
  }
  componentDidMount() {
    this.regLampInfo("12");
    this.regLampInfo("13");
  }
  render() {
    return (
      <Store.Provider
        value={{
          state: this.state,
          mouseIN: () =>
            this.setState((prevState) => ({
              ...prevState,
              hover: true
            })),
          mouseOUT: () =>
            this.setState((prevState) => ({
              ...prevState,
              hover: false
            })),
          setLamp: (id, stateLamp, colorLamp, brightLamp) => {
            console.log("param ", brightLamp);
            this.setState((prevState) => ({
              light: {
                ...prevState.light,
                [id]: {
                  state: stateLamp,
                  color: colorLamp,
                  bright: brightLamp
                }
              }
            }));
          }
        }}
      >
        {this.props.children}
      </Store.Provider>
    );
  }
}

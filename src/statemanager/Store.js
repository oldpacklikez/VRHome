import React from 'react';

const Store = React.createContext();

export const Consumer = Store.Consumer;

export class Provider extends React.Component {
	state = {
		hover: false,
		light: {
			'12': {
				state: null,
				color: 'white',
				bright: 25,
			},
			'13': {
				state: null,
				color: 'white',
				bright: 25
			}
		}
	};
	componentWillUpdate(nextState) {
		console.log(nextState);
	}
	shouldComponentUpdate(prevState, nextState) {
		console.log(nextState);
		return !Object.is(prevState, nextState);
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
					setLamp: (id, stateLamp, colorLamp,brightLamp) => {
						console.log("param ",brightLamp)
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

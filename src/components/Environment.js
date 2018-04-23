import 'aframe';
import 'babel-polyfill';
import { Entity } from 'aframe-react';
import React from 'react';
import { Consumer } from '../statemanager/Store';
class Environment extends React.Component {
	render() {
		return (
			<Entity>
				{/* <Entity primitive="a-plane" src="#groundTexture" rotation="-90 0 0" height="100" width="100" /> */}
				<Consumer>
					{(context) => (
						<React.Fragment>
							<Entity
								primitive="a-light"
								type="point"
								color={context.state.light['13'].color}
								intensity={
									context.state.light['13'].state ? context.state.light['13'].bright / 100 : '0.25'
								}
								position="-0.589 3 -4.572"
							/>
							<Entity
								primitive="a-light"
								type="point"
								color={context.state.light['12'].color}
								intensity={
									context.state.light['12'].state ? context.state.light['12'].bright / 100 : '0.25'
								}
								position="-0.589 3 5.592"
							/>
						</React.Fragment>
					)}
				</Consumer>

				{/* <Entity primitive="a-sky" height="2048" radius="40" src="#skyTexture" theta-length="90" width="2048" /> */}
				<Entity
					gltf-model={'#room'}
					position={{ x: 0.453, y: 0.002, z: -0.23 }}
					scale={{ x: 2, y: 2, z: 2 }}
					emissiveIntensity="1"
				/>
			</Entity>
		);
	}
}

export default Environment;

import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import sampleFishes from '../sample-fishes.js';
import Fish from './Fish';
import base from '../Base';

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			fishes: {},
			order: {}
		};
	}

	// base.syncState(@{String} of URL we want to sync with}, @{Object} with context (this) and state we actually want to sync (fishes))
	componentWillMount() {
		// This runs right before the app is rendered
		this.ref = base.syncState(`${this.props.params.storeId}/fishes`
			, {
				context: this,
				state: 'fishes'
			});

		//Check if there's an order in localStorage
		const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);

		if(localStorageRef){
			// Update App component's order state
			this.setState({
				order: JSON.parse(localStorageRef)
			})
		}
	}

	componentWillUnmount() {
		base.removeBinding(this.ref);
	}

	// this runs whenever PROPS or STATE changes
	componentWillUpdate(nextProps, nextState) {
		localStorage.setItem(`order-${this.props.params.storeId}`,
			JSON.stringify(nextState.order));
	}

	// @{Object}	fish
	addFish = (fish) => {
		// update our state
		const fishes = {...this.state.fishes};
		// add in our new fish
		const timestamp = Date.now();
		fishes[`fish-${timestamp}`] = fish;
		//set state
		this.setState({
			fishes: fishes
		});
	};

	updateFish = (key, updatedFish) => {
		const fishes = {...this.state.fishes};
		fishes[key] = updatedFish;
		this.setState({
			fishes: fishes
		})
	};

	removeFish = key => {
		const fishes = {...this.state.fishes};
		fishes[key] = null; // can't use 'delete' because it doesn't work with FireBase
		this.setState({
			fishes: fishes
		})
	};

	loadSamples = () => {
		this.setState({
			fishes: sampleFishes
		})
	};

	addToOrder = (fish) => {
		// take copy of the state
		const order = {...this.state.order};
		// update new number of fish ordered
		order[fish] = order[fish] + 1 || 1;
		// update state
		this.setState({
			order: order
		})
	};

	removeFromOrder = (key) => {
		const order = {...this.state.order};
		delete order[key];
		this.setState({
			order: order
		})
	};

	render() {

		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Seafood Market"/>
					<ul className="list-of-fishes">
						{
							Object
							.keys(this.state.fishes)
							.map(fish => <Fish key={fish} index={fish} details={this.state.fishes[fish]} addToOrder={this.addToOrder} />)
						}
					</ul>
				</div>
				<Order
					fishes={this.state.fishes}
					order={this.state.order}
					params={this.props.params}
					removeFromOrder={this.removeFromOrder}
				/>

				<Inventory
					fishes={this.state.fishes}
					addFish={this.addFish}
					loadSamples={this.loadSamples}
					updateFish={this.updateFish}
					removeFish={this.removeFish}
					storeId={this.props.params.storeId}
				/>
			</div>
		)
	}
}

App.propTypes = {
	params: React.PropTypes.object.isRequired
}
export default App;
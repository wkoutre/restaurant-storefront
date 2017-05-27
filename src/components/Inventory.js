import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../Base';

class Inventory extends React.Component {
	constructor() {
		super();
		this.state = {
			uid: null,
			owner: null
		}
	}

	componentDidMount() {
		base.onAuth((user) => {
			if (user) {
				this.authHandler(null, { user });
			}
		});
	}

	handleChange = (e, key) => {
		const fish = this.props.fishes[key];
		// take a copy of the fish and update it with the new data
		const updatedFish = {
			...fish,
			[e.target.name]: e.target.value
		}
		
		this.props.updateFish(key, updatedFish);
	}

	renderInventory = (key) => {
		const fish = this.props.fishes[key];

		return (
			<div className="fish-edit" key={key}>
				<input type="text" name="name" value={fish.name} placeholder="Fish Name" onChange={e => this.handleChange(e, key)}/>
				<input type="text" name="price" value={fish.price} placeholder="Fish Price" onChange={e => this.handleChange(e, key)}/>
				<select type="text" name="status" value={fish.status} placeholder="Fish Status" onChange={e => this.handleChange(e, key)}>
					<option value="available">Fresh!</option>
					<option value="unavailable">Sold Out!</option>
				</select>
				<textarea type="text" name="desc" value={fish.desc} placeholder="Fish Desc" onChange={e => this.handleChange(e, key)}>
				</textarea>
				<input type="text" name="image" value={fish.image} placeholder="Fish Image" onChange={e => this.handleChange(e, key)}/>
				<button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
			</div>
		)
	};

	renderLogin = () => {
		return (
			<nav className="login">
				<h2>Inventory</h2>
				<p>Sign in to manage your store's inventory</p>
				<button onClick={() => this.authenticate('github')} className="github">Log In with Github</button>
				<button onClick={() => this.authenticate('facebook')} className="facebook">Log In with Facebook</button>
				<button onClick={() => this.authenticate('twitter')} className="twitter">Log In with Twitter</button>
			</nav>
		)
	};

	authenticate = (provider) => {
		base.authWithOAuthPopup(provider, this.authHandler);
	};

	logout = () => {
		base.unauth();		// connects to FireBase and severs any ties we have
		this.setState({ uid: null });
	};

	authHandler = (err, authData) => {
		if (err) {
			console.error(err);
			return;
		}

		/* grab the store info
		 1. connect to FireBase
		 2. grab copy of info about the current store from the server
		 3. With that info, we need to figure out:
		 	a. Is the user the store owner?
		 		i. If so, display the editable store
		 		ii. If not, IS THERE a store owner?
		 			I.	If so, display 'sorry, you're not the store owner' message
		 			II. If not, make this use the store owner
		*/

		const storeRef = base.database().ref(this.props.storeId);	// so we can use FireBase API with the store's ID

		// query the FireBase once for the store data

		storeRef.once('value', (snapshot) => {
			const data = snapshot.val() || {};

		// claim as the owner if there's no owner
			if (!data.owner) {
				storeRef.set({
					owner: authData.user.uid
				});
			}

			this.setState({
				uid: authData.user.uid,
				owner: data.owner || authData.user.uid
			})
		});
	};

	render() {
		const logout = <button onClick={this.logout}>Log Out</button>
	// check if they're not logged in
		if (!this.state.uid){
			return <div>{this.renderLogin()}</div>
		}

		if (this.state.uid !== this.state.owner) {
			return (
				<div>
					<p>Sorry, you aren't the owner of this store!</p>
					{logout}
				</div>
			)
		}
		return (
			<div>
				<h2>Inventory</h2>
				{logout}
				{Object.keys(this.props.fishes).map(this.renderInventory)}
				<AddFishForm addFish={this.props.addFish}/>
				<button onClick={this.props.loadSamples}>Load Sample Fishes</button>
			</div>
			)
	}
}

Inventory.propTypes = {
	fishes: React.PropTypes.object.isRequired,
	updateFish: React.PropTypes.func.isRequired,
	removeFish: React.PropTypes.func.isRequired,
	addFish: React.PropTypes.func.isRequired,
	loadSamples: React.PropTypes.func.isRequired,
	storeId: React.PropTypes.string.isRequired
}

export default Inventory;
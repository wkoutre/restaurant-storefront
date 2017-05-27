import React from 'react';
import { getFunName } from '../helpers';

class StorePicker extends React.Component {

	goToStore = (event) => {
		event.preventDefault(); // to stop the form from submitting;
		console.log('Changing the URL');
		// first grab text from input
		const storeID = this.storeInput.value;
		console.log(`The value in the input box is ${storeID}`);
		// second transition from / to /store/:storeID
		this.context.router.transitionTo(`/store/${storeID}`);
	};


	render() {
		// This is a regular JS comment
		// Don't put JSX comments at the top-level of return statement

		return(
			<form className="store-selector" onSubmit={this.goToStore}>
			{/*This is a comment inside JSX*/}
				<h2>Please Enter A Store</h2>
				<input
					type="text"
					required placeholder="Store Name"
					defaultValue={getFunName()}
					ref={(input) => {this.storeInput = input}}
				/>
				<button type="submit">Visit Store</button>
			</form>
		)
	}
}

StorePicker.contextTypes = {
	router: React.PropTypes.object
}

export default StorePicker;
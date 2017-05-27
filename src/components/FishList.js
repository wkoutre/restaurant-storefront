import React from 'react';
import Fish from './Fish';

/*
	props:
		@{Object}	fishes:		App's state's fishes property
		@{Array}	fishesArr:	Keys from fishes
*/

class FishList extends React.Component {
	render() {
		// let fishDetails = this.props.fishesArr.map( key => <Fish details={this.props.fishes[key]} fishKey={key}/>)
		// console.log(fishDetails);

		return (
			<ul className="list-of-fishes">
				<Fish details={this.props.fishes[this.props.fishesArr[0]]} key={key}/>
			</ul>
		)
	}
}

export default FishList;
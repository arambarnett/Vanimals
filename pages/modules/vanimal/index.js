import React from 'react';
import BasePage from '../../lib/BasePage';

export default class VanimalPage extends BasePage {
	static async getInitialProps(req, res) {
		return { id: req.query.id };
	}

	render() {
		return (
			<div>
				Vanimal {this.props.id}
			</div>
		);
	}
}

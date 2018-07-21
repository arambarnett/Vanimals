import React from 'react';
import BasePage from '../../lib/BasePage';
import api from '../../utilities/api';

import Footer from '../../components/footer';
import VanimalCard from '../../components/vanimal-card';

export default class VanimalPage extends BasePage {
	static async getInitialProps() {
		const vanimalsResponse = await api.listVanimals();

		return { vanimals: vanimalsResponse.data };
	}

	render() {
		return (
			<div>
				<div className="container-2 w-container">
					<h1 className="heading-2">My Account</h1>
					{this.props.vanimals.map(this.renderVanimal.bind(this))}
				</div>
				<Footer />
			</div>
		);
	}

	renderVanimal(vanimal) {
		return <VanimalCard key={vanimal.vanimal_id} vanimal={vanimal} />;
	}
}

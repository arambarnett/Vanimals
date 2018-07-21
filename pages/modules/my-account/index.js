import React from 'react';
import BasePage from '../../lib/BasePage';
import api from '../../utilities/api';

import Grid from '@material-ui/core/Grid';

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
				</div>
				<Grid container spacing={24} style={{ maxWidth: '964px', margin: '0 auto' }}>
					{this.props.vanimals.map(this.renderVanimal.bind(this))}
				</Grid>
				<Footer />
			</div>
		);
	}

	renderVanimal(vanimal) {
		return (
			<Grid key={vanimal.vanimal_id} item xs={12} sm={6} md={4}>
				<VanimalCard vanimal={vanimal} />
			</Grid>
		);
	}
}

import react from 'react';
import BasePage from './lib/BasePage';

import api from './utilities/api';
import KittyCoreContract from './contracts/KittyCore';
import SaleAuctionContract from './contracts/SaleAuction';
import SiringAuctionContract from './contracts/SiringAuction';

import Grid from '@material-ui/core/Grid';

import ContractForm from './components/contract-form';
import ContractLog from './components/contract-log';
import Vanimal from './components/vanimal-render';

export default class IndexPage extends BasePage {
	static async getInitialProps() {
		return {};
	}

	render() {
		return (
			<div>
				Vanimals
				<Vanimal />
			</div>
		);
	}
}

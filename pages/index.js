import react from 'react';
import BasePage from './lib/BasePage';

import api from './utilities/api';
import KittyCoreContract from './contracts/KittyCore';
import SaleAuctionContract from './contracts/SaleAuction';
import SiringAuctionContract from './contracts/SiringAuction';

import ContractForm from './components/contract-form';

export default class IndexPage extends BasePage {
	static async getInitialProps() {
		const kittyCoreResponse = await KittyCoreContract.fetchContract();
		const saleAuctionResponse = await SaleAuctionContract.fetchContract();
		const siringAuctionResponse = await SiringAuctionContract.fetchContract();

		return {
			kittyCore: kittyCoreResponse.data,
			saleAuction: saleAuctionResponse.data,
			siringAuction: siringAuctionResponse.data
		};
	}

	render() {
		if (!this.props.kittyCore) {
			return <div>Loading</div>;
		}

		return (
			<div>
				<ContractForm contract={this.props.kittyCore} Contract={KittyCoreContract} />
				<ContractForm contract={this.props.saleAuction} Contract={SaleAuctionContract} />
				<ContractForm contract={this.props.siringAuction} Contract={SiringAuctionContract} />
			</div>
		);
	}
}

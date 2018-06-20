import React from 'react';
import BasePage from '../../lib/BasePage';

import api from '../../utilities/api';
import KittyCoreContract from '../../contracts/KittyCore';
import SaleAuctionContract from '../../contracts/SaleAuction';
import SiringAuctionContract from '../../contracts/SiringAuction';

import Grid from '@material-ui/core/Grid';

import ContractForm from '../../components/contract-form';
import ContractLog from '../../components/contract-log';

export default class AdminPage extends BasePage {
	state = {
		log: ''
	};

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
				<div
					style={{
						width: 'calc(100% - 8px)',
						maxHeight: 'calc(100vh - 238px)',
						overflowY: 'auto',
						padding: '12px',
						margin: '-8px'
					}}
				>
					<Grid container spacing={24}>
						<Grid item xs={12}>
							<ContractForm
								contract={this.props.kittyCore}
								Contract={KittyCoreContract}
								onLog={this.handleLog.bind(this)}
							/>
						</Grid>
						<Grid item xs={12}>
							<ContractForm
								contract={this.props.saleAuction}
								Contract={SaleAuctionContract}
								onLog={this.handleLog.bind(this)}
							/>
						</Grid>
						<Grid item xs={12}>
							<ContractForm
								contract={this.props.siringAuction}
								Contract={SiringAuctionContract}
								onLog={this.handleLog.bind(this)}
							/>
						</Grid>
					</Grid>
				</div>
				<div
					style={{
						position: 'fixed',
						bottom: 0,
						left: 0,
						height: '200px',
						width: 'calc(100% - 24px)',
						padding: '12px'
					}}
				>
					<ContractLog log={this.state.log} />
				</div>
			</div>
		);
	}

	handleLog(response) {
		this.setState({ log: this.state.log + response });
	}
}

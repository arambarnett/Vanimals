import React from 'react';
import BasePage from '../../lib/BasePage';

import api from '../../utilities/api';

import VanimalDog from '../../contracts/VanimalDog';
import VanimalElephant from '../../contracts/VanimalElephant';
import VanimalPanda from '../../contracts/VanimalPanda';
import VanimalPigeon from '../../contracts/VanimalPigeon';
import VanimalSealion from '../../contracts/VanimalSealion';

import Grid from '@material-ui/core/Grid';

import ContractForm from '../../components/contract-form';
import ContractLog from '../../components/contract-log';

export default class AdminPage extends BasePage {
	state = {
		log: ''
	};

	static async getInitialProps() {
		const dogResponse = await VanimalDog.fetchContract();
		const dogSaleAuctionResponse = await VanimalDog.SaleAuction.fetchContract();
		const dogSiringAuctionResponse = await VanimalDog.SiringAuction.fetchContract();

		const elephantResponse = await VanimalElephant.fetchContract();
		const elephantSaleAuctionResponse = await VanimalElephant.SaleAuction.fetchContract();
		const elephantSiringAuctionResponse = await VanimalElephant.SiringAuction.fetchContract();

		const pandaResponse = await VanimalPanda.fetchContract();
		const pandaSaleAuctionResponse = await VanimalPanda.SaleAuction.fetchContract();
		const pandaSiringAuctionResponse = await VanimalPanda.SiringAuction.fetchContract();

		const pigeonResponse = await VanimalPigeon.fetchContract();
		const pigeonSaleAuctionResponse = await VanimalPigeon.SaleAuction.fetchContract();
		const pigeonSiringAuctionResponse = await VanimalPigeon.SiringAuction.fetchContract();

		const sealionResponse = await VanimalSealion.fetchContract();
		const sealionSaleAuctionResponse = await VanimalSealion.SaleAuction.fetchContract();
		const sealionSiringAuctionResponse = await VanimalSealion.SiringAuction.fetchContract();

		return {
			dog: dogResponse.data,
			dogSaleAuction: dogSaleAuctionResponse.data,
			dogSiringAuction: dogSiringAuctionResponse.data,
			elephant: elephantResponse.data,
			elephantSaleAuction: elephantSaleAuctionResponse.data,
			elephantSiringAuction: elephantSiringAuctionResponse.data,
			panda: pandaResponse.data,
			pandaSaleAuction: pandaSaleAuctionResponse.data,
			pandaSiringAuction: pandaSiringAuctionResponse.data,
			pigeon: pigeonResponse.data,
			pigeonSaleAuction: pigeonSaleAuctionResponse.data,
			pigeonSiringAuction: pigeonSiringAuctionResponse.data,
			sealion: sealionResponse.data,
			sealionSaleAuction: sealionSaleAuctionResponse.data,
			sealionSiringAuction: sealionSiringAuctionResponse.data,
		};
	}

	render() {
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
								contract={this.props.dog}
								Contract={VanimalDog}
								onLog={this.handleLog.bind(this)}
							/>
						</Grid>
						<Grid item xs={12}>
							<ContractForm
								contract={this.props.dogSaleAuction}
								Contract={VanimalDog.SaleAuction}
								onLog={this.handleLog.bind(this)}
							/>
						</Grid>
						<Grid item xs={12}>
							<ContractForm
								contract={this.props.dogSiringAuction}
								Contract={VanimalDog.SiringAuction}
								onLog={this.handleLog.bind(this)}
							/>
						</Grid>
						<Grid item xs={12}>
							<ContractForm
								contract={this.props.elephant}
								Contract={VanimalElephant}
								onLog={this.handleLog.bind(this)}
							/>
						</Grid>
						<Grid item xs={12}>
							<ContractForm
								contract={this.props.elephantSaleAuction}
								Contract={VanimalElephant.SaleAuction}
								onLog={this.handleLog.bind(this)}
							/>
						</Grid>
						<Grid item xs={12}>
							<ContractForm
								contract={this.props.elephantSiringAuction}
								Contract={VanimalElephant.SiringAuction}
								onLog={this.handleLog.bind(this)}
							/>
						</Grid>
						<Grid item xs={12}>
							<ContractForm
								contract={this.props.panda}
								Contract={VanimalPanda}
								onLog={this.handleLog.bind(this)}
							/>
						</Grid>
						<Grid item xs={12}>
							<ContractForm
								contract={this.props.pandaSaleAuction}
								Contract={VanimalPanda.SaleAuction}
								onLog={this.handleLog.bind(this)}
							/>
						</Grid>
						<Grid item xs={12}>
							<ContractForm
								contract={this.props.pandaSiringAuction}
								Contract={VanimalPanda.SiringAuction}
								onLog={this.handleLog.bind(this)}
							/>
						</Grid>
						<Grid item xs={12}>
							<ContractForm
								contract={this.props.pigeon}
								Contract={VanimalPigeon}
								onLog={this.handleLog.bind(this)}
							/>
						</Grid>
						<Grid item xs={12}>
							<ContractForm
								contract={this.props.pigeonSaleAuction}
								Contract={VanimalPigeon.SaleAuction}
								onLog={this.handleLog.bind(this)}
							/>
						</Grid>
						<Grid item xs={12}>
							<ContractForm
								contract={this.props.pigeonSiringAuction}
								Contract={VanimalPigeon.SiringAuction}
								onLog={this.handleLog.bind(this)}
							/>
						</Grid>
						<Grid item xs={12}>
							<ContractForm
								contract={this.props.sealion}
								Contract={VanimalSealion}
								onLog={this.handleLog.bind(this)}
							/>
						</Grid>
						<Grid item xs={12}>
							<ContractForm
								contract={this.props.sealionSaleAuction}
								Contract={VanimalSealion.SaleAuction}
								onLog={this.handleLog.bind(this)}
							/>
						</Grid>
						<Grid item xs={12}>
							<ContractForm
								contract={this.props.sealionSiringAuction}
								Contract={VanimalSealion.SiringAuction}
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

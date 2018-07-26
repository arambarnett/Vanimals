import React from 'react';
import BasePage from '../../lib/BasePage';

import api from '../../utilities/api';

import VanimalCore from '../../lib/VanimalCore';

import Grid from '@material-ui/core/Grid';

import ContractForm from '../../components/contract-form';
import ContractLog from '../../components/contract-log';

export default class AdminPage extends BasePage {
	state = {
		log: ''
	};

	static async getInitialProps() {
		const vanimalResponse = await VanimalCore.fetchContract();
		const vanimalSaleAuctionResponse = await VanimalCore.SaleAuction.fetchContract();
		const vanimalSiringAuctionResponse = await VanimalCore.SiringAuction.fetchContract();


		return {
			vanimal: vanimalResponse.data,
			vanimalSaleAuction: vanimalSaleAuctionResponse.data,
			vanimalSiringAuction: vanimalSiringAuctionResponse.data,
		};
	}

	render() {
		return (
			<div>
				<div
					style={{
						width: 'calc(100% - 8px)',
						maxHeight: 'calc(100vh - 292px)',
						overflowY: 'auto',
						padding: '12px',
					}}
				>
					<Grid container spacing={24}>
						<Grid item xs={12}>
							<ContractForm
								contract={this.props.vanimal}
								Contract={VanimalCore}
								onLog={this.handleLog.bind(this)}
							/>
						</Grid>
						<Grid item xs={12}>
							<ContractForm
								contract={this.props.vanimalSaleAuction}
								Contract={VanimalCore.SaleAuction}
								onLog={this.handleLog.bind(this)}
							/>
						</Grid>
						<Grid item xs={12}>
							<ContractForm
								contract={this.props.vanimalSiringAuction}
								Contract={VanimalCore.SiringAuction}
								onLog={this.handleLog.bind(this)}
							/>
						</Grid>
					</Grid>
				</div>
				<div
					style={{
						position: 'fixed',
						bottom: '24px',
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

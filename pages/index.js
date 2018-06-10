import react from 'react';
import BasePage from './base/page';

import api from './utilities/api';

export default class IndexPage extends BasePage {
	state = {
		kittyCore: {},
		saleAuction: {},
		siringAuction: {}
	};

	static async getInitialProps() {
		const kittyCoreResponse = await api.fetchKittyCoreContract();

		return {
			kittyCore: kittyCoreResponse.data,
		};
	}

	render() {
		if (!this.props.kittyCore) {
			return <div>Loading</div>;
		}

		return (
			<div>
				Kitty Core: {this.props.kittyCore.address}
				{this.props.kittyCore.abi
					.filter(e => e.constant)
					.map(this.renderCall.bind(this, 'kittyCore'))}
			</div>
		);
	}

	renderCall(contract, method, index) {
		return (
			<div style={{ margin: '12px 0' }} key={`call-${contract}${index}`}>
				<button
					onClick={this.handleOnClick.bind(this, contract, method)}
					style={{ fontWeight: 'bold', display: 'inline-block' }}
				>
					{method.name}
				</button>
				{method.inputs.map(this.renderInput.bind(this, contract, method))}
				{this.renderValue(contract, method)}
			</div>
		);
	}

	renderValue(contract, method) {
		const value = this.state[contract][`${method.name}-value`];

		if (!value) {
			return;
		}

		return (
			<div style={{ marginTop: '12px' }}>
				{JSON.stringify(value, null, 2)}
			</div>
		);
	}

	renderInput(contract, method, input, index) {
		return (
			<input
				key={`input-${contract}${index}`}
				onChange={this.handleOnChange.bind(this, contract, method, input)}
				value={this.state[contract][`${method.name}-${input.name}`]}
				placeholder={input.name}
				style={{ display: 'inline-block', marginLeft: '12px' }}
			/>
		);
	}

	handleOnChange(contract, method, input, evt) {
		const c = this.state[contract];

		return this.setState({
			[contract]: Object.assign({}, c, { [`${method.name}-${input.name}`]: evt.target.value })
		});
	}

	async handleOnClick(contract, method) {
		const payload = {};
		const inputs = method.inputs.forEach(each => {
			payload[each.name] = this.state[contract][`${method.name}-${each.name}`];
		});

		const response = await api.fetchKittyCoreCall(method, payload);

		const c = this.state[contract];
		return this.setState({
			[contract]: Object.assign({}, c, { [`${method.name}-value`]: response.data })
		});
	}
}

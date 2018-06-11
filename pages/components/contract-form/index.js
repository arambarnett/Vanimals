import react from 'react';
import BaseComponent from '../../lib/BaseComponent';

export default class ContractForm extends BaseComponent {
	state = {};

	render() {
		if (!this.props.contract) {
			return <div>Loading</div>;
		}

		return (
			<div>
				{this.props.Contract.objectName}: {this.props.contract.address}
				{this.props.contract.abi.filter(e => e.constant).map(this.renderCall.bind(this))}
				{this.props.contract.abi.filter(e => !e.constant).map(this.renderCall.bind(this))}
			</div>
		);
	}

	renderCall(method, index) {
		return (
			<div style={{ margin: '12px 0' }} key={`call-${index}`}>
				<button
					onClick={this.handleOnClick.bind(this, method)}
					style={{
						fontWeight: 'bold',
						display: 'inline-block',
						background: method.constant ? 'blue' : 'red',
						height: '36px',
						borderRadius: '7px',
						color: 'white',
						border: 'none',
						padding: '8px 12px'
					}}
				>
					{method.name}
				</button>
				{(method.inputs || []).map(this.renderInput.bind(this, method))}
				{this.renderValue(method)}
			</div>
		);
	}

	renderValue(method) {
		const value = this.state[`${method.name}-value`];

		if (!value) {
			return;
		}

		return <div style={{ marginTop: '12px' }}>{JSON.stringify(value, null, 2)}</div>;
	}

	renderInput(method, input, index) {
		return (
			<input
				key={`input-${index}`}
				onChange={this.handleOnChange.bind(this, method, input)}
				value={this.state[`${method.name}-${input.name}`]}
				placeholder={`${input.name} ${input.type}`}
				style={{
					display: 'inline-block',
					marginLeft: '12px',
					background: 'rgba(0, 0, 0, .1)',
					borderRadius: '7px',
					height: '36px',
					padding: '0 12px',
					border: 'none'
				}}
			/>
		);
	}

	handleOnChange(method, input, evt) {
		return this.setState({
			[`${method.name}-${input.name}`]: evt.target.value
		});
	}

	async handleOnClick(method) {
		const payload = {};
		const inputs = method.inputs.forEach(each => {
			payload[each.name] = this.state[`${method.name}-${each.name}`];
		});

		if (!method.constant) {
			const args = Object.keys(payload).map(e => payload[e]);
			const instance = await this.props.Contract.deployed();

			return await instance[method.name](...args, { from: web3.eth.accounts[0] });
		}

		const response = await this.props.Contract.callContract(method, payload);

		return this.setState({ [`${method.name}-value`]: response.data });
	}
}

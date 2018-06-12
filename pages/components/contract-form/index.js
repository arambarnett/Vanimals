import react from 'react';
import BaseComponent from '../../lib/BaseComponent';
import Grid from '@material-ui/core/Grid';

export default class ContractForm extends BaseComponent {
	state = {
		log: ''
	};

	render() {
		if (!this.props.contract) {
			return <div>Loading</div>;
		}

		return (
			<Grid container spacing={0}>
				<Grid item xs={12}>
					{this.props.Contract.objectName}: {this.props.contract.address}
					{this.props.contract.abi.filter(e => e.constant).map(this.renderCall.bind(this))}
					{this.props.contract.abi.filter(e => !e.constant).map(this.renderCall.bind(this))}
				</Grid>
			</Grid>
		);
	}

	renderCall(method, index) {
		if (method.type === 'fallback' || method.type === 'constructor') {
			return;
		}

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
						padding: '8px 12px',
						cursor: 'pointer'
					}}
				>
					{method.name}
				</button>
				{(method.inputs || []).map(this.renderInput.bind(this, method))}
			</div>
		);
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

		let response;
		let log = `${this.props.Contract.objectName}`;
		log = log + `.${method.name}(${Object.values(payload).join(', ')})`;

		try {
			const args = Object.keys(payload).map(e => payload[e]);
			const instance = await this.props.Contract.deployed();

			response = await instance[method.name](...args, { from: web3.eth.accounts[0] });
			log = log + `\n${JSON.stringify(response, null, 2)}`;
		} catch (e) {
			log = log + `\n${e}`;
		}

		this.props.onLog(`${log}\n\n`);
	}
}

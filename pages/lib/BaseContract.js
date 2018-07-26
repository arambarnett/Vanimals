import truffleProvider from 'truffle-provider';
import truffleContract from 'truffle-contract';
import ethUnit from 'ethjs-unit';
import api from '../utilities/api';

export default class BaseContract {
	static get objectName() {
		throw new Error('you must implement `objectName`');
	}

	static get contractRoute() {
		throw new Error('you must implement `contractRoute`');
	}

	static async deployed() {
		const C = this.Contract;

		if (typeof web3 !== 'undefined') {
			C.setProvider(
				truffleProvider.create({
					provider: function() {
						return web3.currentProvider;
					},
					network_id: '*',
					gasPrice: ethUnit.toWei(0.1, 'gwei')
				})
			);
		} else {
			C.setProvider(
				truffleProvider.create({
					host: '127.0.0.1',
					port: 9545,
					network_id: '*',
					gasPrice: ethUnit.toWei(0.1, 'gwei')
				})
			);
		}

		return await C.deployed();
	}

	static get Contract() {
		const json = require(`../../contracts/build/${this.objectName}.json`);

		return truffleContract(json);
	}

	static async fetchContract() {
		return await api.fetchContract(this.contractRoute);
	}

	static async callContract(method, payload) {
		return api.callContract(this.contractRoute, method, payload);
	}
}

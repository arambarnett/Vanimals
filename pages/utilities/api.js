const axios = require('axios');
const qs = require('qs');

class Api {
	constructor(config) {
		this.client = axios.create(
			Object.assign(
				{
					baseURL: `http://localhost:4001/apis`
				},
				config
			)
		);
	}

	get Client() {
		return this.client;
	}

	async fetchKittyCoreContract(params) {
		return this.client.get(`/contracts/kitty-core`, { params });
	}

	async fetchKittyCoreSaleAuctionContract(params) {
		return this.client.get(`/contracts/kitty-core/sale-auction`, { params });
	}

	async fetchKittyCoreSiringAuctionContract(params) {
		return this.client.get(`/contracts/kitty-core/siring-auction`, { params });
	}

	async fetchKittyCoreCall(method, payload, params) {
		const payloadString = `?${qs.stringify(payload)}`;
		return this.client.get(`/contracts/kitty-core/${method.name}${Object.keys(payload).length ? payloadString : ''}`, { params });
	}
}

export default new Api();

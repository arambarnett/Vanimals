import axios from 'axios';
import qs from 'qs';

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

	async fetchContract(route, params) {
		return this.client.get(`/contracts/${route}`, { params });
	}

	async callContract(route, method, payload, params) {
		const payloadString = `?${qs.stringify(payload)}`;
		return this.client.get(
			`/contracts/${route}/${method.name}${Object.keys(payload).length ? payloadString : ''}`,
			{ params }
		);
	}

	async listVanimals(params) {
		return this.client.get(`/rest/vanimals`, params);
	}

	async fetchVanimal(vanimalId, params) {
		return this.client.get(`/rest/vanimals/${vanimalId}`, params);
	}

	async listAttributes(params) {
		return this.client.get(`/rest/attributes`, params);
	}
}

export default new Api();

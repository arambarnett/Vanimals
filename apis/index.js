const router = require('express').Router();

const BaseApi = require('js-base-lib/lib/BaseApi');
const ContractsApi = require('./ContractsApi');
const ConnectApi = require('./ConnectApi');
const RestApi = require('./RestApi');

class ApisApi extends BaseApi {
	static get name() {
		return 'apis';
	}

	static get apiRoutes() {
		return [
			{
				name: ContractsApi.name,
				router: ContractsApi.apiRouter
			},
			{
				name: ConnectApi.name,
				router: ConnectApi.apiRouter
			},
			{
				name: RestApi.name,
				router: RestApi.apiRouter
			}
		];
	}
}

module.exports = ApisApi;

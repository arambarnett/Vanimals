const BaseApi = require('../lib/BaseApi');
const KittyCore = require('../models/KittyCoreContract');

class ContractsApi extends BaseApi {
	static get name() {
		return 'contracts';
	}

	static get apiRoutes() {
		return [
			{
				name: 'kitty-core',
				router: KittyCore.contractRouter
			}
		];
	}
}

module.exports = ContractsApi;

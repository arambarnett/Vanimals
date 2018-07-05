const BaseApi = require('js-base-lib/lib/BaseApi');
const Vanimal = require('../models/Vanimal');
const SaleAuction = require('../models/SaleAuction');
const SiringAuction = require('../models/SiringAuction');

class ContractsApi extends BaseApi {
	static get name() {
		return 'contracts';
	}

	static get apiRoutes() {
		return [
			{
				name: 'vanimal',
				router: Vanimal.contractRouter
			},
			{
				name: 'sale-auction',
				router: SaleAuction.contractRouter
			},
			{
				name: 'siring-auction',
				router: SiringAuction.contractRouter
			}
		];
	}
}

module.exports = ContractsApi;

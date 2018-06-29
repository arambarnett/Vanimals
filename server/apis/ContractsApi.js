const BaseApi = require('js-base-lib/lib/BaseApi');
const VanimalDog = require('../models/VanimalDog');
const VanimalElephant = require('../models/VanimalElephant');
const VanimalPanda = require('../models/VanimalPanda');
const VanimalPigeon = require('../models/VanimalPigeon');
const VanimalSealion = require('../models/VanimalSealion');

class ContractsApi extends BaseApi {
	static get name() {
		return 'contracts';
	}

	static get apiRoutes() {
		return [
			{
				name: 'vanimal-dog',
				router: VanimalDog.contractRouter
			},
			{
				name: 'vanimal-elephant',
				router: VanimalElephant.contractRouter
			},
			{
				name: 'vanimal-panda',
				router: VanimalPanda.contractRouter
			},
			{
				name: 'vanimal-pigeon',
				router: VanimalPigeon.contractRouter
			},
			{
				name: 'vanimal-sealion',
				router: VanimalSealion.contractRouter
			}
		];
	}
}

module.exports = ContractsApi;

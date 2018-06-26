const BaseVanimalContract = require('../lib/BaseVanimalContract');

class VanimalSealion extends BaseVanimalContract {
	static get objectName() {
		return 'VanimalSealion';
	}
}

module.exports = VanimalSealion;

const BaseVanimalContract = require('../lib/BaseVanimalContract');

class VanimalPanda extends BaseVanimalContract {
	static get objectName() {
		return 'VanimalPanda';
	}
}

module.exports = VanimalPanda;

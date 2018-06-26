const BaseVanimalContract = require('../lib/BaseVanimalContract');

class VanimalPigeon extends BaseVanimalContract {
	static get objectName() {
		return 'VanimalPigeon';
	}
}

module.exports = VanimalPigeon;

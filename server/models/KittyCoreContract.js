const BaseVanimalContract = require('../lib/BaseVanimalContract');

class KittyCoreContract extends BaseVanimalContract {
	static get objectName() {
		return 'KittyCore';
	}
}

module.exports = KittyCoreContract;

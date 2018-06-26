const BaseVanimalContract = require('../lib/BaseVanimalContract');

class VanimalDog extends BaseVanimalContract {
	static get objectName() {
		return 'VanimalDog';
	}
}

module.exports = VanimalDog;

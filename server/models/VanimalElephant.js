const BaseVanimalContract = require('../lib/BaseVanimalContract');

class VanimalElephant extends BaseVanimalContract {
	static get objectName() {
		return 'VanimalElephant';
	}
}

module.exports = VanimalElephant;

const BaseContract = require('js-base-lib/lib/BaseContract');

class SaleAuction extends BaseContract {
	static get objectName() {
		return `VanimalCoreSaleAuction`;
	}

	static get truffleConfig() {
		const config = require('../truffle').networks[process.env.NODE_ENV];

		return config;
	}

	static get contractJson() {
		const json = require(`../build/contracts/VanimalCoreSaleAuction.json`);

		return json;
	}
}

module.exports = SaleAuction;

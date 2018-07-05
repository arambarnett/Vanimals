const BaseContract = require('js-base-lib/lib/BaseContract');

class SiringAuction extends BaseContract {
	static get objectName() {
		return `VanimalCoreSiringAuction`;
	}

	static get truffleConfig() {
		const config = require('../../truffle').networks[process.env.NODE_ENV];

		return config;
	}

	static get contractJson() {
		const json = require(`../../build/contracts/VanimalCoreSiringAuction.json`);

		return json;
	}
}

module.exports = SiringAuction;

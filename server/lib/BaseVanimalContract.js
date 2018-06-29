const BaseContract = require('js-base-lib/lib/BaseContract');

class VanimalContract extends BaseContract {
	static get truffleConfig() {
		const config = require('../../truffle').networks[process.env.NODE_ENV];

		return config;
	}

	static get contractJson() {
		const json = require(`../../build/contracts/${this.objectName}.json`);

		return json;
	}
}

class BaseVanimal extends VanimalContract {
	static async contractRoutes(router) {
		await super.contractRoutes(router);

		const instance = await this.deployed();
		const saleContract = await instance.saleAuction();
		const siringAuction = await instance.siringAuction();
		const objectName = this.objectName;

		class SaleAuction extends VanimalContract {
			static get objectName() {
				return `${objectName}SaleAuction`;
			}
		}

		class SiringAuction extends VanimalContract {
			static get objectName() {
				return `${objectName}SiringAuction`;
			}
		}

		router.use('/sale-auction', SaleAuction.contractRouter);
		router.use('/siring-auction', SiringAuction.contractRouter);
	}
}

module.exports = BaseVanimal;

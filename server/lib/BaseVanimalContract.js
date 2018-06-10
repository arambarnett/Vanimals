const BaseContract = require('./BaseContract');

class BaseVanimal extends BaseContract {
	static async routes(router) {
		await super.routes(router);

		const instance = await this.deployed();
		const saleContract = await instance.saleAuction();
		const siringAuction = await instance.siringAuction();

		class SaleAuction extends BaseContract {
			static get objectName() {
				return 'SaleClockAuction';
			}
		}

		class SiringAuction extends BaseContract {
			static get objectName() {
				return 'SiringClockAuction';
			}
		}

		router.use('/sale-auction', SaleAuction.router);
		router.use('/siring-auction', SiringAuction.router);
	}
};

module.exports = BaseVanimal;

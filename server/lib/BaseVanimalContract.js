const BaseContract = require('./BaseContract');

class BaseVanimal extends BaseContract {
	static async contractRoutes(router) {
		await super.contractRoutes(router);

		const instance = await this.deployed();
		const saleContract = await instance.saleAuction();
		const siringAuction = await instance.siringAuction();
		const objectName = this.objectName;

		class SaleAuction extends BaseContract {
			static get objectName() {
				return `${objectName}SaleAuction`;
			}
		}

		class SiringAuction extends BaseContract {
			static get objectName() {
				return `${objectName}SiringAuction`;
			}
		}

		router.use('/sale-auction', SaleAuction.contractRouter);
		router.use('/siring-auction', SiringAuction.contractRouter);
	}
}

module.exports = BaseVanimal;

import BaseContract from '../lib/BaseContract';

export default class VanimalCore extends BaseContract {
	static get objectName() {
		return 'VanimalCore';
	}

	static get contractRoute() {
		return `vanimal`;
	}

	static get SaleAuction() {
		const objectName = this.objectName;
		const contractRoute = this.contractRoute;

		return class SaleAuction extends BaseContract {
			static get objectName() {
				return `${objectName}SaleAuction`;
			}

			static get contractRoute() {
				return `sale-auction`;
			}
		}
	}

	static get SiringAuction() {
		const objectName = this.objectName;
		const contractRoute = this.contractRoute;

		return class SiringAuction extends BaseContract {
			static get objectName() {
				return `${objectName}SiringAuction`;
			}

			static get contractRoute() {
				return `siring-auction`;
			}
		}
	}
}

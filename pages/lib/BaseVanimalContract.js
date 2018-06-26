import BaseContract from '../lib/BaseContract';

export default class BaseVanimalContract extends BaseContract {
	static get SaleAuction() {
		const objectName = this.objectName;
		const contractRoute = this.contractRoute;

		return class SaleAuction extends BaseContract {
			static get objectName() {
				return `${objectName}SaleAuction`;
			}

			static get contractRoute() {
				return `${contractRoute}/sale-auction`;
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
				return `${contractRoute}/siring-auction`;
			}
		}
	}
}

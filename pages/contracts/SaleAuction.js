import BaseContract from '../lib/BaseContract';

export default class SaleAuctionContract extends BaseContract {
	static get objectName() {
		return 'SaleClockAuction';
	}

	static get contractRoute() {
		return 'kitty-core/sale-auction';
	}
}

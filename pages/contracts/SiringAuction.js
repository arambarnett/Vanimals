import BaseContract from '../lib/BaseContract';

export default class SiringAuctionContract extends BaseContract {
	static get objectName() {
		return 'SiringClockAuction';
	}

	static get contractRoute() {
		return 'kitty-core/siring-auction';
	}
}

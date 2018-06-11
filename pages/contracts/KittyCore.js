import BaseContract from '../lib/BaseContract';

export default class KittyCoreContract extends BaseContract {
	static get objectName() {
		return 'KittyCore';
	}

	static get contractRoute() {
		return 'kitty-core';
	}
}

import BaseVanimalContract from '../lib/BaseVanimalContract';

export default class VanimalPigeonContract extends BaseVanimalContract {
	static get objectName() {
		return 'VanimalPigeon';
	}

	static get contractRoute() {
		return 'vanimal-panda';
	}
}

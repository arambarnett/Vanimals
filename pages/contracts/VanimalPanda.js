import BaseVanimalContract from '../lib/BaseVanimalContract';

export default class VanimalPandaContract extends BaseVanimalContract {
	static get objectName() {
		return 'VanimalPanda';
	}

	static get contractRoute() {
		return 'vanimal-panda';
	}
}

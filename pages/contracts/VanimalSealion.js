import BaseVanimalContract from '../lib/BaseVanimalContract';

export default class VanimalSealionContract extends BaseVanimalContract {
	static get objectName() {
		return 'VanimalSealion';
	}

	static get contractRoute() {
		return 'vanimal-sealion';
	}
}

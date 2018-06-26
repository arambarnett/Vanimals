import BaseVanimalContract from '../lib/BaseVanimalContract';

export default class VanimalElephantContract extends BaseVanimalContract {
	static get objectName() {
		return 'VanimalElephant';
	}

	static get contractRoute() {
		return 'vanimal-elephant';
	}
}

import BaseVanimalContract from '../lib/BaseVanimalContract';

export default class VanimalDogContract extends BaseVanimalContract {
	static get objectName() {
		return 'VanimalDog';
	}

	static get contractRoute() {
		return 'vanimal-dog';
	}
}

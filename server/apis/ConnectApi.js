const BaseApi = require('../lib/BaseApi');
const FacebookAccount = require('../models/FacebookAccount');

class ConnectApi extends BaseApi {
	static get name() {
		return 'connect';
	}

	static get apiRoutes() {
		return [
			{
				name: 'facebook-accounts',
				router: FacebookAccount.connectRouter
			}
		];
	}
}

module.exports = ConnectApi;

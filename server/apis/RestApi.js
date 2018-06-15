const BaseApi = require('../lib/BaseApi');
const User = require('../models/User');
const FacebookAccount = require('../models/FacebookAccount');
const Vanimal = require('../models/Vanimal');

class RestApi extends BaseApi {
	static get name() {
		return 'rest';
	}

	static get apiRoutes() {
		return [
			{
				name: 'users',
				router: User.restRouter
			},
			{
				name: 'facebook-accounts',
				router: FacebookAccount.restRouter
			},
			{
				name: 'vanimals',
				router: Vanimal.restRouter
			}
		];
	}
}

module.exports = RestApi;

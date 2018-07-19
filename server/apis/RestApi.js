const BaseApi = require('js-base-lib/lib/BaseApi');

const Attribute = require('../models/Attribute');
const FacebookAccount = require('../models/FacebookAccount');
const User = require('../models/User');
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
			},
			{
				name: 'attributes',
				router: Attribute.restRouter
			}
		];
	}
}

module.exports = RestApi;

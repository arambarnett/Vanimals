const BaseConnectRouter = require('../lib/BaseConnectRouter');
const FacebookStrategy = require('passport-facebook').Strategy;

class FacebookAccount extends BaseConnectRouter {
	static get objectName() {
		return 'FacebookAccount';
	}

	static get passportStrategy() {
		return FacebookStrategy;
	}

	static get passportConfiguration() {
		return {
			clientID: process.env.FACEBOOK_APP_ID,
			clientSecret: process.env.FACEBOOK_APP_SECRET,
			callbackURL: `/apis/connect/facebook-account/callback`,
			scope: [],
			passReqToCallback: true
		};
	}

	static async passportCallback(req, accessToken, refreshToken, profile, done) {
		console.log({ accessToken, refreshToken, profile });

		done(null);
	}
}

module.exports = FacebookAccount;

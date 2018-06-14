const BaseRouter = require('./BaseRouter');
const passport = require('passport');

class BaseConnectRouter extends BaseRouter {
	static get connectRouter() {
		const router = this.router;

		passport.use(
			this.objectName,
			new this.passportStrategy(this.passportConfiguration, this.passportCallback)
		);

		router.get('/', passport.authenticate(this.objectName));
		router.get('/callback', passport.authenticate(this.objectName));

		return router;
	}

	static get passportStrategy() {
		throw new Error('You must override `passportStrategy` with an instance of a Passport Strategy');
	}

	static get passportConfiguration() {
		throw new Error('You must override `passportConfiguration`');
	}

	static async passportCallback() {
		throw new Error('You must override `passportCallback`');
	}
}

module.exports = BaseConnectRouter;

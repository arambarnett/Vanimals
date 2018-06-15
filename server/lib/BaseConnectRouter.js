const BaseRouter = require('./BaseRouter');

const passport = require('passport');

class BaseConnectRouter extends BaseRouter() {
	static get connectRouter() {
		const router = this.router;

		passport.use(
			this.objectName,
			new this.passportStrategy(this.passportConfiguration, this.passportCallback)
		);

		router.get(
			'/',
			(req, res, next) => {
				req.session.redirect = req.query.redirect;

				return next();
			},
			passport.authenticate(this.objectName)
		);

		router.get('/callback', passport.authenticate(this.objectName), (req, res, next) => {
			if (!req.session.redirect) {
				return res.redirect('/');
			}

			return res.redirect(req.session.redirect);
		});

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

const BaseRouter = require('./BaseRouter');
const pkg = require('../../package.json');

class BaseApi extends BaseRouter() {
	static get name() {
		throw new Error(`you must implement 'name'`);
	}

	static get apiRoutes() {
		return [];
	}

	static get apiRouter() {
		const router = this.router;

		router.get('/', (req, res) => {
			res.status(200).json({
				api: `/${this.name}`,
				name: pkg.name,
				version: pkg.version,
				apis: this.apiRoutes.map(e => `/${e.name}`)
			});
		});

		this.apiRoutes.forEach(each => {
			router.use(`/${each.name}`, each.router);
		});

		return router;
	}
}

module.exports = BaseApi;

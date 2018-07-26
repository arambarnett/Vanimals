require('dotenv').config();

const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const Next = require('next');
const passport = require('passport');
const sslRedirect = require('heroku-ssl-redirect');
const session = require('js-base-lib/lib/RedisSession');
const routes = require('./routes');

require('./lib/passport');

const port = process.env.PORT || 4001;
const next = Next({ dir: '.', dev: process.env.NODE_ENV !== 'production' });

(async () => {
	await next.prepare();

	const app = express();

	app.use(compression());
	app.use(bodyParser.json());
	app.use(sslRedirect(['production'], 301));
	app.use(session);
	app.use(passport.initialize());
	app.use(passport.session());

	const apis = require('./apis');
	app.use('/apis', apis.apiRouter, errorWare);
	app.get('*', routes.getRequestHandler(next));

	app.listen(port, () => {
		const { name, version } = require('./package.json');

		console.log(`${name} v${version} server listening on port ${port}`);
	});
})();

const errorWare = (error, req, res, done) => {
	console.log('ROUTE ERR', error);

	return res.sendStatus(500);
};

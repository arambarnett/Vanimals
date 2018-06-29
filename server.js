require('dotenv').config();

const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const { parse } = require('url');
const Next = require('next');
const passport = require('passport');
const session = require('js-base-lib/lib/RedisSession');
const routes = require('./routes');

require('./server/lib/passport');

const port = process.env.PORT || 4001;
let next = Next({ dir: '.', dev: process.env.NODE_ENV !== 'production' });
const routeHandler = routes.getRequestHandler(next);

main();

async function main() {
	await next.prepare();

	const app = express();

	app.use(compression());
	app.use(bodyParser.json());
	app.use(session);
	app.use(passport.initialize());
	app.use(passport.session());

	const apis = require('./server/apis');
	app.use('/apis', apis.apiRouter, errorWare);
	app.get('*', routeHandler);

	app.listen(port, () => {
		const { name, version } = require('./package.json');

		console.log(`${name} v${version} server listening on port ${port}`);
	});
}

const errorWare = (error, req, res, next) => {
	console.log('ROUTE ERR', error);

	return res.sendStatus(500);
};

require('dotenv').config();

const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');

const apis = require('./server/apis');

const app = express();

app.use(compression());
app.use(bodyParser.json());

const errorWare = (error, req, res, next) => {
	console.log('ROUTE ERR', error);

	return res.sendStatus(500);
};

app.use('/apis', apis, errorWare);

const port = process.env.PORT || 4001;

app.listen(port, () => {
	const { name, version } = require('./package.json');

	console.log(`${name} v${version} server listening on port ${port}`);
})

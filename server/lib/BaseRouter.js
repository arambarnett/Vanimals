const express = require('express');
const BaseModel = require('./BaseModel');

class BaseRouter extends BaseModel {
	static routes(router) {
		throw new Error('you must implement `routes`');
	}

	static get router() {
		const router = express.Router();

		this.routes(router);

		return router;
	}
}

module.exports = BaseRouter;

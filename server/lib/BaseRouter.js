const express = require('express');
const BaseModel = require('./BaseModel');

class BaseRouter extends BaseModel {
	static get router() {
		const router = express.Router();

		return router;
	}
}

module.exports = BaseRouter;

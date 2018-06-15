const express = require('express');

class BaseRouter {
	static get router() {
		const router = express.Router();

		return router;
	}
}

module.exports = BaseRouter;

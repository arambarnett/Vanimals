const express = require('express');
const BaseModel = require('./BaseModel');

module.exports = (Model = BaseModel) => {
	return class BaseRouter extends Model {
		static get router() {
			const router = express.Router();

			return router;
		}
	};
};

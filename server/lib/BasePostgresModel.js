const sequelize = require('./sequelize');
const BaseModel = require('./BaseModel');

module.exports = (Model = BaseModel) => {
	return class BasePostgresModel extends Model {
		static get tableName() {
			throw new Error('You must specify `tableName`');
		}

		static fieldMap() {
			throw new Error('You must specify `fieldMap`');
		}

		static get Postgres() {
			const model = sequelize.define(this.tableName, this.fieldMap(require('sequelize')), {
				createdAt: 'created_at',
				updatedAt: 'updated_at'
			});

			this.associations(model);

			return model;
		}

		static associations(Model) {
			return Model;
		}
	};
};

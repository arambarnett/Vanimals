const BaseRestModel = require('js-base-lib/lib/BaseRestModel');

class Attribute extends BaseRestModel() {
	static get objectName() {
		return 'Attribute';
	}

	static get tableName() {
		return 'attributes';
	}

	static fieldMap(Sequelize) {
		return {
			attribute_id: {
				type: Sequelize.BIGINT,
				primaryKey: true,
				allowNull: false,
				autoIncrement: true
			},
			name: {
				type: Sequelize.TEXT,
				allowNull: false
			}
		};
	}
}

module.exports = Attribute;

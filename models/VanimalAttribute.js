const BasePostgresModel = require('js-base-lib/lib/BasePostgresModel');

const Vanimal = require('./Vanimal');
const Attribute = require('./Attribute');

class VanimalAttribute extends BasePostgresModel() {
	static get objectName() {
		return 'VanimalAttribute';
	}

	static get tableName() {
		return 'vanimal_attributes';
	}

	static fieldMap(Sequelize) {
		return {
			attribute_id: {
				type: Sequelize.BIGINT,
				allowNull: false,
				references: {
					model: Attribute.Postgres,
					key: 'attribute_id'
				}
			},
			vanimal_id: {
				type: Sequelize.BIGINT,
				allowNull: false,
				references: {
					model: Vanimal.Postgres,
					key: 'vanimal_id'
				}
			}
		};
	}
}

module.exports = VanimalAttribute;

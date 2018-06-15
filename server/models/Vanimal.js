const BaseRestModel = require('../lib/BaseRestModel');

class Vanimal extends BaseRestModel() {
	static get objectName() {
		return 'Vanimal';
	}

	static get tableName() {
		return 'vanimals';
	}

	static fieldMap(Sequelize) {
		return {
			vanimal_id: {
				type: Sequelize.BIGINT,
				primaryKey: true,
				allowNull: false,
				autoIncrement: true
			},
			is_gestating: {
				type: Sequelize.BOOLEAN,
				allowNull: false
			},
			is_ready: {
				type: Sequelize.BOOLEAN,
				allowNull: false
			},
			cooldown_index: {
				type: Sequelize.BIGINT,
				allowNull: false
			},
			next_action_at: {
				type: Sequelize.BIGINT,
				allowNull: false
			},
			siring_with_id: {
				type: Sequelize.BIGINT,
				allowNull: false
			},
			birth_time: {
				type: Sequelize.BIGINT,
				allowNull: false
			},
			matron_id: {
				type: Sequelize.BIGINT,
				allowNull: false
			},
			sire_id: {
				type: Sequelize.BIGINT,
				allowNull: false
			},
			generation: {
				type: Sequelize.BIGINT,
				allowNull: false
			},
			genes: {
				type: Sequelize.BIGINT,
				allowNull: false
			}
		};
	}
}

module.exports = Vanimal;

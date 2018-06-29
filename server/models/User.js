const BaseRestModel = require('js-base-lib/lib/BaseRestModel');
const FacebookAccount = require('./FacebookAccount');

class User extends BaseRestModel() {
	static get objectName() {
		return 'User';
	}

	static get tableName() {
		return 'users';
	}

	static fieldMap(Sequelize) {
		return {
			user_id: {
				type: Sequelize.BIGINT,
				primaryKey: true,
				allowNull: false,
				autoIncrement: true
			},
			name: {
				type: Sequelize.TEXT,
				allowNull: false
			},
			icon_url: {
				type: Sequelize.TEXT
			},
			facebook_account_id: {
				references: {
					model: FacebookAccount.Postgres,
					key: 'facebook_account_id'
				},
				type: Sequelize.BIGINT,
				allowNull: false
			}
		};
	}
}

module.exports = User;

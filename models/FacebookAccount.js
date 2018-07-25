const BaseConnectRouter = require('js-base-lib/lib/BaseConnectRouter');
const BaseRestModel = require('js-base-lib/lib/BaseRestModel');

const FacebookStrategy = require('passport-facebook').Strategy;

class FacebookAccount extends BaseRestModel(BaseConnectRouter) {
	static get objectName() {
		return 'FacebookAccount';
	}

	static get tableName() {
		return 'facebook_accounts';
	}

	static fieldMap(Sequelize) {
		return {
			facebook_account_id: {
				type: Sequelize.BIGINT,
				primaryKey: true,
				allowNull: false,
				autoIncrement: true
			},
			access_token: {
				type: Sequelize.TEXT,
				allowNull: false
			},
			external_facebook_account_id: {
				type: Sequelize.TEXT,
				allowNull: false
			}
		};
	}

	static get passportStrategy() {
		return FacebookStrategy;
	}

	static get passportConfiguration() {
		return {
			clientID: process.env.FACEBOOK_APP_ID,
			clientSecret: process.env.FACEBOOK_APP_SECRET,
			callbackURL: `/apis/connect/facebook-accounts/callback`,
			scope: [],
			passReqToCallback: true
		};
	}

	static async passportCallback(req, accessToken, refreshToken, profile, done) {
		const FA = FacebookAccount.Postgres;
		const User = require('./User');

		try {
			let facebookAccount = await FA.findOne({
				where: { external_facebook_account_id: profile.id }
			});

			if (facebookAccount) {
				facebookAccount = await facebookAccount.update({ access_token: accessToken });
			} else {
				facebookAccount = await FA.create({
					external_facebook_account_id: profile.id,
					access_token: accessToken
				});
			}

			let user = await User.Postgres.findOne({
				where: { facebook_account_id: facebookAccount.facebook_account_id }
			});

			if (!user) {
				user = await User.Postgres.create({
					name: profile.displayName,
					icon_url: profile.profileUrl,
					facebook_account_id: facebookAccount.facebook_account_id
				});
			}

			return done(null, user);
		} catch (e) {
			done(e);
		}
	}
}

module.exports = FacebookAccount;

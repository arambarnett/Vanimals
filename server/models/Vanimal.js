const BaseRestModel = require('js-base-lib/lib/BaseRestModel');
const BaseContract = require('js-base-lib/lib/BaseContract');

class Vanimal extends BaseRestModel(BaseContract) {
	static get truffleConfig() {
		const config = require('../../truffle').networks[process.env.NODE_ENV];

		return config;
	}

	static get contractJson() {
		const json = require(`../../build/contracts/VanimalCore.json`);

		return json;
	}

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
			owner: {
				type: Sequelize.TEXT,
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
			genes: {
				type: Sequelize.BIGINT,
				allowNull: false
			},
			is_featured: {
				type: Sequelize.BOOLEAN,
			},
			name: {
				type: Sequelize.TEXT
			},
			short_description: {
				type: Sequelize.TEXT
			},
			population: {
				type: Sequelize.TEXT
			},
			status: {
				type: Sequelize.TEXT
			},
			distribution: {
				type: Sequelize.TEXT
			},
			description: {
				type: Sequelize.TEXT
			},
			location: {
				type: Sequelize.TEXT
			},
			rarity: {
				type: Sequelize.TEXT
			},
			image_url: {
				type: Sequelize.TEXT
			}
		};
	}
}
module.exports = Vanimal;

(async () => {
	const vanimal = await Vanimal.deployed();
	vanimal.Birth(async (error, result) => {
		if (error || !result) {
			console.log('BIRTH ERROR', error);
		}

		const payload = {
			vanimal_id: result.args.kittyId.toString(),
			owner: result.args.owner,
			matron_id: result.args.matronId.toString(),
			sire_id: result.args.sireId.toString(),
			genes: result.args.genes.toString()
		}

		await Vanimal.Postgres.findOrCreate({ where: { vanimal_id: payload.vanimal_id }, defaults: payload });
	});
})();

const BaseRouter = require('./BaseRouter');

const truffleContract = require('truffle-contract');
const truffleProvider = require('truffle-provider');

const truffleConfig = require('../../truffle').networks[process.env.NODE_ENV];

class BaseContract extends BaseRouter {
	static async routes(router) {
		const instance = await this.deployed();
		const calls = instance.abi.filter(e => e.constant);

		calls.map(each => this.routeCall(router, instance, each));

		router.get('/', (req, res, next) => {
			return res.status(200).json({
				address: instance.address,
				abi: instance.abi
			});
		});
	}

	static async routeCall(router, contract, method) {
		router.get(`/${method.name}`, async (req, res, next) => {
			try {
				const inputs = method.inputs.map(e => req.query[e.name]);
				const result = await contract[method.name](...inputs);

				const response = { response: result };

				if (Array.isArray(result)) {
					method.outputs.map((e, i) => {
						response[e.name] = result[i];
					});
				}

				return res.status(200).json(response);
			} catch (e) {
				next(e);
			}
		});
	}

	static async deployed() {
		const C = this.Contract;

		C.setProvider(truffleProvider.create(truffleConfig));

		return await C.deployed();
	}

	static get Contract() {
		const json = require(`../../build/contracts/${this.objectName}.json`);

		return truffleContract(json);
	}
}

module.exports = BaseContract;

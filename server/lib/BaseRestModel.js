const _ = require('lodash');
const BaseModel = require('./BaseModel');
const BasePostgresModel = require('./BasePostgresModel');
const BaseRouter = require('./BaseRouter');

module.exports = (Model = BaseModel) => {
	return class BaseRestModel extends BasePostgresModel(BaseRouter(Model)) {
		static get middlewares() {
			return {
				list: [],
				create: [],
				read: [],
				update: [],
				delete: []
			};
		}

		static get restRouter() {
			const router = this.router;

			router.get('/', this.middlewares.list, this.list.bind(this));
			router.post('/', this.middlewares.create, this.create.bind(this));
			router.get('/:id', this.middlewares.read, this.read.bind(this));
			router.patch('/:id', this.middlewares.update, this.update.bind(this));
			router.delete('/:id', this.middlewares.delete, this.delete.bind(this));

			Object.keys(this.Postgres.associations).forEach(key => {
				const a = this.Postgres.associations[key];

				if (a.associationType === 'HasMany' || a.associationType === 'BelongsTo') {
					router.get(
						`/:id/${a.as.toLowerCase()}`,
						this.middlewares.read,
						async (req, res, next) => {
							try {
								const instance = await this.Postgres.findById(req.params.id);

								if (!instance) {
									return res.sendStatus(404);
								}

								const result = await instance[a.accessors.get]();

								if (!result) {
									return res.sendStatus(404);
								}

								return res.status(200).json(result);
							} catch (e) {
								next(e);
							}
						}
					);
					router.post(
						`/:id/${a.as.toLowerCase()}`,
						this.middlewares.read,
						async (req, res, next) => {
							try {
								const instance = await this.Postgres.findById(req.params.id);
								const payload = req.body;

								if (!instance) {
									return res.sendStatus(404);
								}

								const result = await instance[a.accessors.create](payload);

								return res.status(200).json(result);
							} catch (e) {
								next(e);
							}
						}
					);
				}
			});

			return router;
		}

		static async list(req, res, next) {
			try {
				const where = _.omit(req.query, ['sort', 'limit', 'offset']);
				const order = req.query.sort || [];
				const limit = req.query.limit;
				const offset = req.query.offset;

				const response = await this.Postgres.findAll({ where, order, limit, offset });

				return res.status(200).json(response);
			} catch (e) {
				next(e);
			}
		}

		static async create(req, res, next) {
			try {
				const payload = req.body;
				const instance = await this.Postgres.create(payload);

				return res.status(201).json(instance);
			} catch (e) {
				next(e);
			}
		}

		static async read(req, res, next) {
			try {
				const instance = await this.Postgres.findById(req.params.id);

				if (!instance) {
					return res.sendStatus(404);
				}

				return res.status(200).json(instance);
			} catch (e) {
				next(e);
			}
		}

		static async update(req, res, next) {
			try {
				const payload = req.body;

				const instance = await this.Postgres.findById(req.params.id);

				if (!instance) {
					return res.sendStatus(404);
				}

				const newInstance = await instance.update(payload);

				return res.status(200).json(newInstance);
			} catch (e) {
				next(e);
			}
		}

		static async delete(req, res, next) {
			try {
				const instance = await this.Postgres.findById(req.params.id);

				if (!instance) {
					return res.sendStatus(404);
				}

				await instance.destroy();

				return res.sendStatus(204);
			} catch (e) {
				next(e);
			}
		}
	};
};

const { Sequelize } = require("sequelize");
const { capitalize } = require("../utils");
const cls = require("cls-hooked");
const factory = require("./models");

/*
 *  Make use of continuation local storage
 *  to automatically couple operations to
 *  current transaction in callback chains
*/
const namespace = cls.createNamespace("database");
Sequelize.useCLS(namespace);

const Database = async ({
  config: {
    DB: {
      MAX_POOL_SIZE,
      MIN_POOL_SIZE,
      CONNECTION_URI,
      VERBOSE,
      NAME,
    }
  },
}) => {
  const connection = new Sequelize(
    [CONNECTION_URI, NAME].join("/"),
    {
      ...(!VERBOSE && { logging: false }),
      pool: {
        max: MAX_POOL_SIZE,
        min: MIN_POOL_SIZE,
        idle: 30000
      },
      benchmark: true,
    }
  );

  await connection.authenticate();

  /*
   * Capitalize models to distinguish from variables
  */
  const models = Object.entries(factory)
    .reduce((prev, curr) => ({ ...prev, [capitalize(curr[0])]: curr[1](connection) }), {});

  /*
   * Run model associations.
  */
  Object.values(models).forEach((model) => {
    if (model.associate) {
      model.associate(models);
    }
  });

  /*
  *  Create tables if not exists
  */
  await connection.sync();

  return {
    connection,
    models
  };
};

module.exports = Database;

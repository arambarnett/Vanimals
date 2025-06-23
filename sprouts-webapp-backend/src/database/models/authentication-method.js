const config = require("../../config");
const Sequelize = require("sequelize");
const { createPrefixedId } = require("../../utils");

const { DataTypes } = Sequelize;

module.exports = (sequelize) => {
  const AuthenticationMethod = sequelize.define("authenticationMethod",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => createPrefixedId("aum"),
      },
      method: {
        type: DataTypes.STRING,
        unique: "authentication_method",
        required: true,
      },
      value: {
        type: DataTypes.STRING,
        unique: "authentication_method",
        required: true,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      tableName: "authentication-methods",
      timestamps: true,
    });

  let options = {};
  if (config.DANGEROUSLY_ENABLE_TESTING_TOOLS === "true") {
    options = { onDelete: "CASCADE" };
  }

  AuthenticationMethod.associate = (models) => {
    AuthenticationMethod.belongsTo(models.User, options);
  };
  return AuthenticationMethod;
};


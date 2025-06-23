const Sequelize = require("sequelize");
const { createPrefixedId } = require("../../utils");

const { DataTypes } = Sequelize;

module.exports = (sequelize) => {
  const Session = sequelize.define("session",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => createPrefixedId("ses"),
      },
      userAgent: {
        type: DataTypes.STRING,
        defaultValue: null,
        required: false,
      },
      blacklistedAt: {
        type: DataTypes.DATE,
        required: false,
        defaultValue: () => new Date()
      },
      ip: {
        type: DataTypes.STRING,
        required: false,
        defaultValue: null
      },
    },
    {
      tableName: "sessions",
      timestamps: true,
    });

  Session.associate = (models) => {
    Session.belongsTo(models.AuthenticationMethod);
    Session.belongsTo(models.User);
  };
  return Session;
};


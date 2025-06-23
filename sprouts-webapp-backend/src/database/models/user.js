const Sequelize = require("sequelize");
const { createPrefixedId } = require("../../utils");

const { DataTypes } = Sequelize;

module.exports = (sequelize) => {
  const User = sequelize.define("user",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => createPrefixedId("usr"),
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bio: {
        type: DataTypes.STRING,
        allowNull: true
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      tableName: "users",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["email"],
          where: {
            email: {
              [Sequelize.Op.ne]: null
            }
          },
        },
        {
          unique: true,
          fields: ["username"],
        },
      ],
    });

  User.associate = (models) => {
    User.hasMany(models.AuthenticationMethod);
    User.hasMany(models.Session);
  };
  
  return User;
};

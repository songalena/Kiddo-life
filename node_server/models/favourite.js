const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // The path might vary

const Favourite = sequelize.define(
  "Favourite",
  {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    place_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Places",
        key: "id",
      },
    },
  },
  {}
);

module.exports = Favourite;

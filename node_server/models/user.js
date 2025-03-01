const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // The path might vary

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {

});

module.exports = User;
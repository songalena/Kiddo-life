const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:121614@localhost:5432/kiddolife_db'); // Update with your credentials

module.exports = sequelize;
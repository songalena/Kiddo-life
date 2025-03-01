const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:kiddo_life_pass_strong@localhost:5432/kiddolife_db'); // Update with your credentials

module.exports = sequelize;
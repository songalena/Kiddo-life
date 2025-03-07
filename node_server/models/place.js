const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // The path might vary

const Place = sequelize.define('Place', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.STRING,
    allowNull: false
  },
  area: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image_src: {
    type: DataTypes.STRING,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  longitude: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  approval_status: {
    type: DataTypes.ENUM,
    values: ['Active', 'Draft', 'Rejected'],
    defaultValue: 'Active'
  },
}, {

});

module.exports = Place;
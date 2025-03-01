const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // The path might vary

const UserToRole = sequelize.define('UserToRole', {
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Roles',
          key: 'id'
        }
      },
}, {
  
});

module.exports = UserToRole;
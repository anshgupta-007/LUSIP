// userSchema.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const mailSender = require('../utils/mailSender');
const welcomeTemplate=require('../mail/templates/welcomeTemplate');
const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accountType: {
    type: DataTypes.ENUM('Admin', 'Student', 'Instructor'),
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resetpasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  verifyToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
}, { timestamps: false });


module.exports = User;

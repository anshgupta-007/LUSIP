// projectSchema.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./userSchema.js'); // Import User model

const Project = sequelize.define('Project', {
  projectName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  projectDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  instructor: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
    allowNull: false,
  },
  prerequisites: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  preferredBranch: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, { timestamps: false });

// Define association after model is fully loaded
Project.belongsTo(User, { foreignKey: 'instructor', as: 'instructorId'});

module.exports = Project;

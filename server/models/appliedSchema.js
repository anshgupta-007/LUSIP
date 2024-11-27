const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Project = require('./projectSchema');  // Import Project model
const User = require('./userSchema');  // Import User model

const Applied = sequelize.define('Applied', {
  project: {
    type: DataTypes.INTEGER,  // Assuming project is a foreign key referencing 'Projects' table
    references: {
      model: Project,         // Reference to the Project table
      key: 'id',              // Assuming 'id' is the primary key of the 'Projects' table
    },
    allowNull: false,         // Field is required
  },
  student: {
    type: DataTypes.INTEGER,  // Assuming student is a foreign key referencing 'Users' table
    references: {
      model: User,            // Reference to the User table
      key: 'id',              // Assuming 'id' is the primary key of the 'Users' table
    },
    allowNull: false,         // Field is required
  },
  instructor: {
    type: DataTypes.INTEGER,  // Assuming instructor is a foreign key referencing 'Users' table
    references: {
      model: User,            // Reference to the User table
      key: 'id',              // Assuming 'id' is the primary key of the 'Users' table
    },
    allowNull: false,         // Field is required
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Declined'),  // Enum for status field
    allowNull: false,         // Field is required
  },
  reason: {
    type: DataTypes.STRING,   // Reason is a string (optional)
    allowNull: true,          // Field is optional
  },
}, {
  timestamps: false,  // No automatic timestamps (if not needed)
  tableName: 'Applied', // The name of the table in MySQL
});

Applied.belongsTo(User, { foreignKey: 'student', as: 'studentId'});
Applied.belongsTo(Project, { foreignKey: 'project', as: 'projectId'});

module.exports = Applied;

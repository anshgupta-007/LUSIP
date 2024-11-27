const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Import your sequelize instance
const mailSender = require('../utils/mailSender');
const emailTemplate = require('../mail/templates/emailVerificationTemplate');

const OTP = sequelize.define('OTP', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'otp',
  timestamps: false,
});

// After create hook to set expiration date and send email
OTP.afterCreate(async (otpInstance) => {
  try {
    // Set the expiration date to 5 minutes after creation
    otpInstance.expiresAt = new Date(otpInstance.createdAt).getTime() + 15 * 60 * 1000; // 5 minutes in milliseconds
    await otpInstance.save();

    console.log("New OTP document saved to database");

    // Send verification email after creating the OTP
    await sendVerificationEmail(otpInstance.email, otpInstance.otp);
  } catch (error) {
    console.log("Error occurred while processing OTP:", error);
  }
});

// Function to send email
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(email, "Verification Email", emailTemplate(otp));
    console.log("Email sent successfully: ", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}

module.exports = OTP;

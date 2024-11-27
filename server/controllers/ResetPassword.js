const User=require("../models/userSchema");
const mailSender=require('../utils/mailSender');
const crypto=require('crypto');
const bcrypt = require('bcrypt');
const {passwordUpdated}=require("../mail/templates/passwordUpdate");
const passwordResetEmail=require("../mail/templates/passwordResetEmail");
//reset passwordtoken
exports.resetPasswordToken = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Your email is not registered with us',
        });
      }
  
      // Generate a random token for password reset
      const token = crypto.randomUUID();
  
      // Update the user record with the reset token and expiration time
      const updatedUser = await user.update({
        token: token,
        resetpasswordExpires: Date.now() + 5 * 60 * 1000, // Token expires in 5 minutes
      });
  
      // Construct the URL for password reset
      const URL = `http://localhost:3000/update-password/${token}`;
      console.log(URL);
  
      // Send the password reset email
      const userName = user.firstName + ' ' + user.lastName;
      await mailSender(
        email,
        'Reset your password using this link',
        passwordResetEmail(userName, URL)
      );
  
      // Return response indicating the email was sent
      return res.json({
        success: true,
        message: 'Email sent successfully, please check your email',
        URL,
        updatedUser,
      });
    } catch (err) {
      console.error(err);
      return res.status(501).json({
        success: false,
        message: 'Something went wrong while generating the password reset link',
      });
    }
  };

exports.resetPassword = async (req, res) => {
try {
    // Get token and passwords from request body
    const { password, token } = req.body;

    // Find user by token
    const user = await User.findOne({ where: { token } });
    if (!user) {
    console.log("Invalid Token - User Not Found");
    return res.status(201).json({
        success: false,
        message: "Invalid Token",
    });
    }

    // Check if token has expired
    if (user.resetpasswordExpires < Date.now()) {
    console.log("Token expired, Please regenerate your token");
    return res.status(202).json({
        success: false,
        message: "Token expired, Please regenerate your token",
    });
    }

    // Hash the new password
    const saltRounds = 10;
    let hashedPassword;

    try {
    hashedPassword = await bcrypt.hash(password, saltRounds);
    } catch (error) {
    console.log("Error in hashing the password");
    console.log(error);
    return res.status(500).json({
        success: false,
        message: "Error hashing the password",
    });
    }

    // Update user's password in the database
    await user.update({
    password: hashedPassword,
    token: null, // Clear the reset token
    resetpasswordExpires: null, // Clear the expiration time
    });

    const userName = `${user.firstName} ${user.lastName}`;

    // Send email confirmation
    try {
    await mailSender(
        user.email,
        `Password Reset Successfully`,
        passwordUpdated(user.email, userName)
    );
    } catch (err) {
    console.log("Error in Sending Email");
    console.log(err);
    return res.status(402).json({
        success: false,
        message: "Error in Sending Email",
    });
    }

    return res.status(200).json({
    success: true,
    message: "Password Reset Successfully",
    });
} catch (err) {
    console.log(err);
    return res.status(402).json({
    success: false,
    message: "Something Went Wrong while resetting the password",
    });
}
};
  

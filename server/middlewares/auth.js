const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const User=require("../models/userSchema");
require('dotenv').config();

exports.auth = async (req, res, next) => {
  try {
    console.log("Auth Middleware Invoked");

    // Extract token from request
    const token =
      req.body.token || 
      req.cookies.token || 
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.log("Token is Missing");
      return res.status(401).json({
        success: false,
        message: "Token Not Found",
      });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user details using Sequelize and ensure user exists
      const user = await User.findByPk(decoded.id); // Assuming _id is the payload key
      if (!user) {
        console.log("User Not Found for the Token");
        return res.status(401).json({
          success: false,
          message: "Invalid Token - User Does Not Exist",
        });
      }

      req.user = decoded; // Attach decoded token payload to request
    } catch (err) {
      console.log("Invalid Token");
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }

    next(); // Proceed to the next middleware
  } catch (err) {
    console.error("Error in Authentication Middleware:", err.message);
    return res.status(500).json({
      success: false,
      message: "Something Went Wrong During Authentication",
    });
  }
};

exports.isStudent = async (req, res, next) => {
    try {
      // Ensure `req.user` exists (set by the `auth` middleware)
      if (!req.user) {
        console.log("No User Found in Request");
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }
  
      // Fetch the user from the database to verify the account type
      const user = await User.findByPk(req.user.id); // Assuming `_id` is in the token payload
      if (!user) {
        console.log("User Not Found in Database");
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }
  
      // Check if the account type is "Student"
      if (user.accountType !== "Student") {
        console.log("Unauthorized Request");
        return res.status(401).json({
          success: false,
          message: "This is a protected route for students",
        });
      }
  
      console.log("Student Verified");
      next(); // Proceed to the next middleware
    } catch (err) {
      console.error("Error Verifying User Role:", err.message);
      return res.status(500).json({
        success: false,
        message: "User role cannot be verified",
      });
    }
};

exports.isInstructor = async (req, res, next) => {
try {
    // Ensure `req.user` exists (set by the `auth` middleware)
    if (!req.user) {
    console.log("No User Found in Request");
    return res.status(401).json({
        success: false,
        message: "Authentication required",
    });
    }

    // Fetch the user from the database to verify the account type
    const user = await User.findByPk(req.user.id); // Assuming `_id` is in the token payload
    if (!user) {
    console.log("User Not Found in Database");
    return res.status(401).json({
        success: false,
        message: "User not found",
    });
    }

    // Check if the account type is "Instructor"
    if (user.accountType !== "Instructor") {
    console.log("Unauthorized Request");
    return res.status(401).json({
        success: false,
        message: "This is a protected route for instructors",
    });
    }

    console.log("Instructor Verified");
    next(); // Proceed to the next middleware
} catch (err) {
    console.error("Error Verifying User Role:", err.message);
    return res.status(500).json({
    success: false,
    message: "User role cannot be verified",
    });
}
};

exports.isAdmin = async (req, res, next) => {
    try {
      // Ensure `req.user` exists (set by the `auth` middleware)
      if (!req.user) {
        console.log("No User Found in Request");
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }
  
      // Fetch the user from the database to verify the account type
      const user = await User.findByPk(req.user.id); // Assuming `_id` is in the token payload
      if (!user) {
        console.log("User Not Found in Database");
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }
  
      // Check if the account type is "Admin"
      if (user.accountType !== "Admin") {
        console.log("Unauthorized Request");
        return res.status(401).json({
          success: false,
          message: "This is a protected route for Admin only",
        });
      }
  
      console.log("Admin Verified");
      next(); // Proceed to the next middleware
    } catch (err) {
      console.error("Error Verifying User Role:", err.message);
      return res.status(500).json({
        success: false,
        message: "User role cannot be verified",
      });
    }
};
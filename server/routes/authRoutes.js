// Import the required modules
const express = require("express");
const router = express.Router();

// Import the required controllers and middleware functions
const {
  login,
  signUp,
  logout,
  sendOTP,
  changePassword,
  about,
  getallInstructor,
  deleteFaculty,
  getallRequests,
  createFacultybyAdmin,
  userPresent,
} = require("../controllers/auth");
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword")

const {auth,isInstructor,isAdmin}= require('../middlewares/auth');
// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", login);

// Route for user signup
router.post("/signup", signUp);

// Route for user login
router.post("/logout", logout);

router.post("/createFacultybyAdmin",auth,isAdmin,createFacultybyAdmin);

// Route for sending OTP to the user's email
router.post("/sendotp", sendOTP)

// Route for Changing the password
router.post("/changepassword", auth, changePassword)

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword);

router.get("/about",auth,about);

router.post("/getAllFaculties",auth,isAdmin,getallInstructor);

router.post("/deleteFaculty/:facultyId",deleteFaculty);

router.post("/getallRequests",auth,isInstructor,getallRequests);

router.post("/userpresent",userPresent);

// Export the router for use in the main application
module.exports = router

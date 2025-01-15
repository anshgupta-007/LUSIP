const express= require('express');
const User=require("../models/userSchema");
const OTP=require("../models/OTP");
const otpgenerator=require('otp-generator');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const mailSender=require('../utils/mailSender');
const Project= require("../models/projectSchema");
const Applied=require('../models/appliedSchema');
const facultyAccountCreatedEmail=require('../mail/templates/facultyAccountCreatedEmail')
const welcomeTemplate=require('../mail/templates/welcomeTemplate');
require('dotenv').config();

exports.userPresent = async (req, res) => {
  console.log("Inside User Present");
  const { email } = req.body; // Extract email from the request body

  // Validate the input
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    // Check if the user exists in the database by email
    const user = await User.findOne({
      where: { email }, // Sequelize syntax for conditions
    });

    //console.log(user);

    if (user) {
      // User is found
      return res.status(200).json({
        success: true,
        message: "User exists.",
      });
    } else {
      // User not found
      return res.status(202).json({
        success: false,
        message: "User not found.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

exports.sendOTP = async (req, res) => {
  try {
    console.log("Inside SEND OTP");
    const { email } = req.body;
    console.log(email);

    // Check if user exists in the database
    const checkUserPresent = await User.findOne({ where: { email } });

    // If user is found
    if (checkUserPresent) {
      console.log("User is already Present");
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      });
    }

    // Generate OTP
    let otp = otpgenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Ensure the generated OTP is unique (check if it exists in the OTP table)
    let result = await OTP.findOne({ where: { otp } });
    while (result) {
      otp = otpgenerator.generate(6, { upperCaseAlphabets: false });
      result = await OTP.findOne({ where: { otp } });
    }

    // Calculate expiresAt time (15 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Add 15 minutes to the current time

    // OTP Payload to be saved in the OTP table, including expiresAt
    const otpPayload = { email, otp, expiresAt };

    // Create OTP record in the database
    const otpBody = await OTP.create(otpPayload);
    console.log("OTP Body", otpBody);

    // Send success response
    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      otp, // In real apps, you would not send OTP in response for security reasons
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.signUp = async (req, res) => {
  try {
    console.log("Inside SignUp ");
    const { firstName, lastName, email, password, confirmPassword, accountType, otp } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
      console.log("All fields are required");
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // Check if passwords match
    if (password !== confirmPassword) {
      console.log("Password Not Matched");
      return res.status(400).json({
        success: false,
        message: "Password and confirmPassword do not match",
      });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already registered",
      });
    }
    // Fetch the most recent OTP
    const recentOTP = await OTP.findOne({
      where: { email },
      order: [['createdAt', 'DESC']], // Sequelize equivalent of sort by createdAt descending
    });

    if (!recentOTP) {
      console.log("OTP not found");
      return res.status(404).json({
        success: false,
        message: "OTP not found",
      });
    }

    // Check if OTP matches
    if (otp !== recentOTP.otp) {
      console.log("Invalid OTP");
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check if OTP is expired (assuming it expires after 15 minutes)
    const otpCreationTime = recentOTP.createdAt.getTime(); // Sequelize provides Date object
    const expiryTime = 15 * 60 * 1000; // 15 minutes
    if (Date.now() - otpCreationTime > expiryTime) {
      console.log("OTP expired");
      return res.status(410).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    console.log("User registered successfully");
    await sendVerificationEmail(email);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    console.error("Error in signup:", err);
    return res.status(500).json({
      success: false,
      message: "User registration failed. Please try again later.",
    });
  }
};

async function sendVerificationEmail(email) {
  try {
    const mailResponse = await mailSender(email, "Acoount Created Successfully", welcomeTemplate(email));
    console.log("Account sent successfully: ");
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}

exports.login = async (req, res) => {
  try {
    console.log("Inside Login");
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Enter all fields");
      return res.status(400).json({
        success: false,
        message: "Fill all Fields",
      });
    }

    // Find user by email
    const user = await User.findOne({
      where: { email }, // Sequelize syntax for querying
    });

    if (!user) {
      console.log("User not found");
      return res.status(200).json({
        success: false,
        message: "User Not Registered",
      });
    }

    // Check if the password matches
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log("Password mismatch");
      return res.status(201).json({
        success: false,
        message: "Password Not Matched",
      });
    }

    // Generate JWT token if the password is correct
    const payload = {
      email: user.email,
      id: user.id, // Using Sequelize `id` instead of MongoDB `_id`
      accountType: user.accountType, // Optionally remove later as you mentioned
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h", // Token expiry time
    });

    // Omit password from the response
    user.password = undefined;

    // Set up the cookie options
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Cookie expiry
      httpOnly: true, // Cookie accessible only by the server
    };

    console.log(`${user.accountType} logged in Successfully`);

    // Send response with the token and user data
    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    console.log("Login failed:", err);
    return res.status(500).json({
      success: false,
      message: "Login failed, please try again",
    });
  }
};

exports.createFacultybyAdmin = async (req, res) => {
  try {
    console.log("Inside Create Faculty by Admin");
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    const adminEmail = req.user.email;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      console.log("All fields are required");
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      console.log("Password Not Matched");
      return res.status(400).json({
        success: false,
        message: "Passwords don't match",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType: "Instructor",
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    console.log("User registered successfully");

    // Send notification email
    const facultyName = `${firstName} ${lastName}`;
    try {
      await mailSender(
        email,
        "Account created for LUSIP Project Listing",
        facultyAccountCreatedEmail(facultyName, adminEmail,password)
      );
    } catch (err) {
      console.log("Error in Sending Email");
      return res.status(500).json({
        success: false,
        message: "Error in sending email",
      });
    }

    // Respond with success
    return res.status(201).json({
      success: true,
      message: "Faculty registered successfully",
      faculty: user,
    });
  } catch (err) {
    console.log("Error in Creating Faculty by Admin");
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error in creating faculty by admin",
    });
  }
};

exports.changePassword= async(req,res)=>{
    try{
      console.log("Inside Change Password");
        const {email,oldPassword,newPasword,confirmnewPassword}=req.body;

        if(!email || !oldPassword || !newPasword || !confirmnewPassword){
            console.log("Enter all fields");
            return res.status(401).json({
                success:false,
                message:"Enter all fields in change Password",
            })
        }

        const user=User.findOne({email});
        if(!user){
            console.log("User not Found");
            res.status(405).json({
                success:false,
                message:"User Not found",
            })
        }
        if(newPasword!==confirmnewPassword){
            console.log("new Password dont match");
            return res.status(401).json({
                success:false,
                message:"Password Field Data not matching",
            })
        }

        let hashedPassword=await bcrypt.hash(oldPassword,10);
        //comparing old password
        if(bcrypt.compare(hashedPassword,user.password)){
            let newHashPassword=await bcrypt.hash(newPasword,10);
            let newUserData=await User.findOneAndUpdate({email:email},{password:newHashPassword},{new:true});

            //Send mail Password Updated
            try{
                const response=mailSender(
                    email,
                    "Password Changed SuccessFully",
                    "Your password has been recently changed"
                );
                console.log("Password Reset SuccessFully");
                //return resopnse
                res.status(200).json({
                    success:true,
                    message:"Password Reset SuccesFully",
                    response,
                })
            }
            catch(err){
                console.log("Error in Sending EMail");
                return res.status(402).json({
                    success:false,
                    message:"Error in Sending Email",
                })
            }
            
        }
        else{
            console.log("Old Password Not matched");
            return res.status(401).json({
                success:false,
                message:"Old Password Not matched",
            })
        }
    }
    catch(err){
        console.log("Error in changing Password");

    }   
}

exports.about = async (req, res) => {
  try {
    console.log("Inside About Controller");
    const user1 = req.user; // Extract the authenticated user details

    if (!user1) {
      return res.status(200).json({
        success: true,
        message: "User Not Found",
      });
    }

    // Fetch the user from the database using Sequelize
    const user = await User.findByPk(user1.id, {
      attributes: { exclude: ['password'] }, // Exclude the password from the response
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found in Database",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User Found",
      user,
    });
  } catch (err) {
    console.error("Error in About Controller:", err.message);
    return res.status(500).json({
      success: false,
      message: "Error in fetching User Data",
    });
  }
};

exports.logout = (req, res) => {
  try {
    console.log("Inside Logout");
    // Clear the cookie by setting it to an empty value and expiry date in the past
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set secure to true in production
      sameSite: 'strict', // Adjust sameSite setting based on your needs
    });

    res.status(200).json({ success: true, message: "User logged out successfully." });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ success: false, message: "Failed to log out the user." });
  }
};

exports.getallInstructor = async (req, res) => {
  try {
    console.log("Inside Get all Instructor");
    // Fetch all users with accountType "Instructor"
    const faculties = await User.findAll({
      where: { accountType: "Instructor" }, // Sequelize equivalent of a MongoDB query
      attributes: ['id', 'firstName', 'lastName', 'email', 'image','accountType'], // Specify the attributes to fetch
    });
    console.log(faculties.length);
    // Check if no instructors are found
    if (faculties.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No instructors found",
      });
    }

    // Return the fetched instructors
    return res.status(200).json({
      success: true,
      message: "All instructors fetched successfully",
      faculties,
    });
  } catch (err) {
    console.error("Error in fetching instructors:", err.message);
    return res.status(500).json({
      success: false,
      message: "Error in fetching user data",
    });
  }
};

exports.deleteFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    console.log("Faculty ID",facultyId);
    // Delete associated projects where instructor matches facultyId

    const appliedDeleted=await Applied.destroy({
      where:{instructor:facultyId},
    })
    const projectsDeleted = await Project.destroy({
      where: { instructor: facultyId },
    });

    // Find and delete the faculty by their ID
    const faculty = await User.findByPk(facultyId);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    await faculty.destroy();

    console.log("Instructor deleted successfully");

    return res.status(200).json({
      success: true,
      message: "Instructor deleted successfully",
      projectsDeleted,
    });
  } catch (err) {
    console.log("Error in deleteFaculty Controller:", err.message);
    return res.status(500).json({
      success: false,
      message: "Error in deleting instructor",
    });
  }
};

exports.getallRequests = async (req, res) => {
  try {
      console.log("Inside Get all requests");

      const instructorId = req.user.id; // Assuming req.user contains authenticated user's info

      // Fetch all requests where the instructor is the one who has applied
      const faculties = await Applied.findAll({
          where: { instructor:instructorId }, // Filtering by instructorId
          include: [
              {
                  model: Project,
                  as: 'projectId', // Alias used in the association
              },
              {
                  model: User,
                  as: 'studentId', // Alias used in the association
              },
          ],
      });

      // If no faculties are found, return a message
      if (faculties.length === 0) {
          return res.status(200).json({
              success: true,
              message: "No requests found",
              faculties,
          });
      }

      // Return the fetched requests
      return res.status(200).json({
          success: true,
          message: "Requests fetched successfully",
          faculties,
      });
  } catch (err) {
      console.error("Error in GetallRequests Controller", err.message);
      return res.status(500).json({
          success: false,
          message: "Error in fetching requests",
          error: err.message,
      });
  }
};

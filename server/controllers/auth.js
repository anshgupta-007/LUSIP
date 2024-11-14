const express= require('express');
const User=require("../models/userSchema");
const OTP=require("../models/OTP");
const Profile=require("../models/Profile"); 
const otpgenerator=require('otp-generator');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const mailSender=require('../utils/mailSender');
const Project= require("../models/projectSchema");
const Applied=require('../models/appliedSchema');
const facultyAccountCreatedEmail=require('../mail/templates/facultyAccountCreatedEmail')
require('dotenv').config();

exports.userPresent = async (req, res) => {
  const { email } = req.body;  // Extract email from request body

  // Validate the input
  if (!email) {
      return res.status(400).json({
          success: false,
          message: "Email is required",
      });
  }

  try {
      // Check if the user exists in the database by email
      const user = await User.findOne({ email: email });

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
        
		const { email } = req.body;
        //console.log(email);
		// Check if user is already present
		// Find user with provided email
		const checkUserPresent = await User.findOne({ email });
		// to be used in case of signup

		// If user found with provided email
		if (checkUserPresent) {
			// Return 401 Unauthorized status code with error message
            console.log("User is already Present");
			return res.status(401).json({
				success: false,
				message: `User is Already Registered`,
			});
		}

		var otp = otpgenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});
		var result = await OTP.findOne({ otp: otp });
		
		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
			});
      result = await OTP.findOne({ otp: otp });
		}
		const otpPayload = { email, otp };
		const otpBody = await OTP.create(otpPayload);
		console.log("OTP Body", otpBody);
		res.status(200).json({
			success: true,
			message: `OTP Sent Successfully`,
			otp,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ success: false, error: error.message });
	}
};

exports.signUp = async (req, res) => {
  try {
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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already registered",
      });
    }

    // Fetch the most recent OTP
    const recentOTP = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (recentOTP.length === 0) {
      console.log("OTP not found");
      return res.status(404).json({
        success: false,
        message: "OTP not found",
      });
    }

    // Check if OTP matches
    if (otp !== recentOTP[0].otp) {
      console.log("Invalid OTP");
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check if OTP is expired (assuming it expires after 15 minutes)
    const otpCreationTime = recentOTP[0].createdAt;
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

    // Create profile details (can add additional fields as needed)
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null
    });

    // Create the user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    });

    console.log("User registered successfully");
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

exports.createFacultybyAdmin=async(req,res)=>{
  try{
    const {firstName, lastName, email, password, confirmPassword} = req.body;
    const adminEmail=req.user.email;
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
      return res.status(200).json({
        success: false,
        message: "Password don't match",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null
    });

    // Create the user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType:"Instructor",
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    });

    console.log("User registered successfully");
    const facultyName=firstName+" "+lastName;
    try{
      const response=mailSender(
        email,
        `Account created for LUSIP Project Listing`,
        facultyAccountCreatedEmail(facultyName,adminEmail)
      );
  }
  catch(err){
      console.log("Error in Sending Email");
      return res.status(402).json({
          success:false,
          message:"Error in Sending Email",
      })
  }

    return res.status(201).json({
      success: true,
      message: "Faculty registered successfully",
      faculty:user,
    });

  }
  catch(err){
    console.log("Error in Creating Faculty by Admin");
    console.log(err);
      return res.status(402).json({
          success:false,
          message:"Error in Creating Faculty by Admin",
      })
  }
}


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Enter all fields");
      return res.status(200).json({
        success: false,
        message: "Fill all Fields",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(200).json({
        success: false,
        message: "User Not Registered",
      });
    }

    var validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log("Password mismatch");
      return res.status(201).json({
        success: false,
        message: "Password Not Matched",
      });
    }

    // Generate a JWT token since password is correct
    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType, // Optionally remove later as you mentioned
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    user.token = token;
    user.password = undefined; // Omit password from the response

    // Create cookies
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    console.log(`${user.accountType} logged in SuccesFully`);
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



exports.changePassword= async(req,res)=>{
    try{
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

exports.about= async(req,res) => {
    try{
        const user1=req.user;

        if(!user1){
            return res.status(200).json({
                success:true,
                message:"User Not found"
            })
        }

        const user=await User.findById(user1.id);
        user.password="";
        return res.status(200).json({
            success:true,
            message:"User Found",
            user
        })
    }
    catch(err){
        console.log("Error in About Controller",err.message);
        return res.status(401).json({
            success:false,
            message:"Error in fetching User Data",
        })
    }
}

exports.logout = (req, res) => {
  try {
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

exports.getallInstructor= async(req,res) => {
    try{
        const faculties=await User.find({accountType:"Instructor"});

        if(faculties.length===0){
            return res.status(200).json({
                success:true,
                message:"instructor Not found"
            })
        }
        
        return res.status(200).json({
            success:true,
            message:"All instructor Fetched",
            faculties
        })
    }
    catch(err){
        console.log("Error in About Controller",err.message);
        return res.status(401).json({
            success:false,
            message:"Error in fetching User Data",
        })
    }
}

exports.deleteFaculty= async(req,res) => {
    try{
        const {facultyId}=req.params;
        const result = await Project.deleteMany({ instructor: facultyId });
        const faculty=await User.findByIdAndDelete(facultyId);


        if(!faculty){
            return res.status(200).json({
                success:true,
                message:"instructor Not found"
            })
        }
        
        console.log("Instructor Deleted SuccesFully");
        return res.status(200).json({
            success:true,
            message:"Instructor Deleted SuccesFully",
        })
    }
    catch(err){
        console.log("Error in About Controller",err.message);
        return res.status(401).json({
            success:false,
            message:"Error in fetching User Data",
        })
    }
}

exports.getallRequests= async(req,res) => {
    try{

        const instructorId=req.user.id;
        const faculties=await Applied.find({instructor:instructorId}).populate("project").populate("student").exec();

        if(faculties.length===0){
            return res.status(200).json({
                success:true,
                message:"NO Requests found",
                faculties
            })
        }
      
        return res.status(200).json({
            success:true,
            message:"Request fetched SuccessFully",
            faculties
        })
    }
    catch(err){
        console.log("Error in GetallReqeust Controller",err.message);
        return res.status(401).json({
            success:false,
            message:"Error in fetching getallRequests",
        })
    }
}

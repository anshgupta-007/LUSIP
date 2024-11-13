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
require('dotenv').config();

exports.sendOTP = async (req, res) => {
	try {
        
		const { email } = req.body;
        console.log(email);
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
		const result = await OTP.findOne({ otp: otp });
		console.log("Result is Generate OTP Func");
		console.log("OTP", otp);
		console.log("Result", result);
		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
			});
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


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Enter all fields");
      return res.status(400).json({
        success: false,
        message: "Please enter both email and password",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Debugging statements
    console.log("User found:", user);
    console.log("Entered password:", password);
    console.log("Stored password hash:", user.password);

    var validPassword = await bcrypt.compare(password, user.password);
    validPassword=true;
    if (!validPassword) {
      console.log("Password mismatch");
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
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
            console.log("new PAssword dont match");
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
                console.log("Password Reset SuccessFully",response),
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

exports.logout= async(req,res)=>{
    try{
        console.log("Inside Logout controller");
        const {userId}=req.params;
        req.user="";


    }
    catch(err){
        console.log("Error in Logout Controller",err.message);
        return res.status(401).json({
            success:false,
            message:"Error in Logout Controller",
        })
    }
}

exports.getallInstructor= async(req,res) => {
    try{
        console.log("Inside getallInstructor");
        const faculties=await User.find({accountType:"Instructor"});

        if(faculties.length===0){
            return res.status(200).json({
                success:true,
                message:"instructor Not found"
            })
        }
        
        console.log("outside getallInstructor");
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
        console.log("Inside Delete Faculty");
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
        console.log(req.user);
        const instructorId=req.user.id;
        console.log(instructorId);
        console.log("Inside getallRequests");
        const faculties=await Applied.find({instructor:instructorId}).populate("project").populate("student").exec();

        if(faculties.length===0){
            return res.status(200).json({
                success:true,
                message:"NO Requests found",
                faculties
            })
        }
        
        console.log("outside getallRequests");
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

const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const User=require("../models/userSchema");

require('dotenv').config();

//auth
exports.auth= async (req,res,next)=>{
    try{
        console.log("Auth Calling");
        const token= req.body.token || req.cookies.token  || req.header("Authorization").replace("Bearer ","");

        if(!token){
            console.log("Token is Missing");
            return res.status(401).json({
                success:false,
                message:"Token Not found",
            })
        }
        
        try{
            const decode=jwt.verify(token,process.env.JWT_SECRET);
            //console.log(decode);
            req.user=decode;
        }
        catch(err){
            console.log("Invalid Token");
            return res.status(401).json({
                success:false,
                message:"Invalid Token",
            })
        }
        next();    
    }
    catch(err){
        console.log("Something Went Wrong while Authentication");
        return res.status(401).json({
            success:false,
            message:"Something Went Wrong while Authentication",
        })
    }
}

exports.isStudent=async (req,res,next)=>{
    try{
        if(req.user.accountType!=="Student"){
            console.log("UnAuthorized Request");
            return res.status(401).json({
                success:false,
                message:"This is a protected route for students",
            })
        }
        console.log("Student Verified");
        next();
    }
    catch(err){
        console.log("User Role can't be verified");
        return res.status(401).json({
            success:false,
            message:"User Role can't be verified",
        })
    }
}


exports.isInstructor=async (req,res,next)=>{
    try{
        if(req.user.accountType!=="Instructor"){
            console.log("UnAuthorized Request");
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Instructor",
            })
        }
        console.log("Instructor Verified");
        next();
    }
    catch(err){
        console.log("User Role can't be verified");
        return res.status(401).json({
            success:false,
            message:"User Role can't be verified",
        })
    }
}

exports.isAdmin=async (req,res,next)=>{
    try{
        if(req.user.accountType!=="Admin"){
            console.log("UnAuthorized Request");
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin only",
            })
        }
        console.log("Admin Verified");
        next();
    }
    catch(err){
        console.log("User Role can't be verified");
        return res.status(401).json({
            success:false,
            message:"User Role can't be verified",
        })
    }
}

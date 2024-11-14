const express= require('express');
const User=require("../models/userSchema");
const OTP=require("../models/OTP");
const Profile=require("../models/Profile"); 
const otpgenerator=require('otp-generator');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const mailSender=require('../utils/mailSender');
const Applied=require('../models/appliedSchema');
const Project = require("../models/projectSchema");
const applyTemplate=require('../mail/templates/projectEnrollmentEmail');
const facultyNotificationEmail=require('../mail/templates/facultyNotificationEmail');
const studentApprovalEmail=require('../mail/templates/studentApprovalEmail');
const studentDeclineEmail=require('../mail/templates/studentDeclineEmail');
require('dotenv').config();

exports.applyOnProject= async(req,res) => {
    const {projectId,instructorId}=req.params;
    const userId=req.user.id;
    //console.log("Inside Apply on Project Controller");
    //console.log(projectId,"   ",userId);
    try{
        const alreadyApplied=await Applied.find({project:projectId,student:userId,instructor:instructorId});
        //console.log(alreadyApplied);
        if(alreadyApplied.length===1){
            return res.status(200).json({
                success:true,
                message:"You have Already Applied on this Project",
            })
        }
        const totalApplied=await Applied.find({student:userId});
        //console.log("Total Applied",totalApplied);
        if(totalApplied.length===2){
            return res.status(200).json({
                success:true,
                message:"You have Reached the Limit to Apply",
            })
        }

        // const ApplyData=await Applied.create({student:userId,project:projectId,status:"Pending"});
        //Send Mail to User and Instructor Both
        const user=await User.findById(userId);
        const project=await Project.findById(projectId).populate("instructor").exec();
        const name=user.firstName+" "+user.lastName;
        const facultyName=project.instructor.firstName+" "+project.instructor.lastName;
        //console.log("Studnet Applied on this Project: ",project);
        try{
            const response=mailSender(
                user.email,
                `SuccessFully Applied on ${project.projectName}`,
                applyTemplate(project.projectName,name)
            );
            console.log(`You have Applied SuccessFully on ${project.projectName}`);
            console.log(`Mail sent to ${user.email}`);
            //return resopnse
            const response2=mailSender(
                project.instructor.email,
                `New Student Applied on ${project.projectName} Project`,
                facultyNotificationEmail(facultyName,name,project.projectName)
            );
            console.log(`Mail sent to ${project.instructor.email}`);

            const applyOnProject=await Applied.create({project:projectId,student:userId,status:"Pending",instructor:instructorId});

            return res.status(200).json({
                success:true,
                message:"Applied SuccessFully",
                applyOnProject
            })
        }
        catch(err){
            console.log("Error in Sending EMail");
            console.log(err);
            return res.status(402).json({
                success:false,
                message:"Error in Sending Email",
            })
        }
    }
    catch(err){
        console.log(err.message,"Error on applying");
		return res.status(500).json({ success: false, error: error.message });
    }
}

exports.changeStatus= async(req,res)=> {
    const {status,applyId,reason}=req.body;
    try{
        const oldapply=await Applied.findById(applyId);
        console.log(oldapply.status);
        if(oldapply.status===status){
            return res.status(200).json({
                success:true,
                message:`Already ${status}`,
                
            })
        }

        const newapply=await Applied.findByIdAndUpdate(applyId,
            {status,reason},
            {new:true},
        )

        const user=await User.findById(newapply.student);
        const project=await Project.findById(newapply.project).populate("instructor").exec();
        const name=user.firstName+" "+user.lastName;
        const facultyName=project.instructor.firstName+" "+project.instructor.lastName;
        if(status==="Approved"){
            try{
                const response=mailSender(
                    user.email,
                    `Faculty has approved you on  ${project.projectName}`,
                    studentApprovalEmail(name,facultyName,project.projectName)
                );
                console.log(`Faculty has approved you on  ${project.projectName}`),
                //return resopnse
                res.status(200).json({
                    success:true,
                    message:"Approved SuccesFully",
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
        else if(status==="Declined"){
            try{
                const response=mailSender(
                    user.email,
                    `Faculty has declined you on  ${project.projectName}`,
                    studentDeclineEmail(name,facultyName,project.projectName)
                );
                console.log(`Faculty has declined you on  ${project.projectName}`),
                //return resopnse
                res.status(200).json({
                    success:true,
                    message:"Declined SuccesFully",
                    response,
                })
            }
            catch(err){
                console.log("Error in Sending Email");
                return res.status(402).json({
                    success:false,
                    message:"Error in Sending Email",
                })
            }
        }

        //add accordingly to both user and project schema
    }
    catch(err){
        console.log(err.message);
        console.log("Error on Changing Status");
		return res.status(500).json({ success: false, error: err.message });
    }
}

exports.cancelApplicationController=async(req,res)=>{
    try {
        const applyId = req.body.applyId;
        const userId = req.user.id; // Assuming user ID is stored in req.user after authentication middleware
        console.log(userId,applyId);
        // Check if the application exists
        const application = await Applied.findOne({ _id: applyId});
        if (!application) {
            console.log("Application not found")
          return res.status(404).json({ success: false, message: "Application not found." });
        }
    
        // Delete the application
        await Applied.deleteOne({ _id: application._id });
    
        res.status(200).json({ success: true, message: "Application cancelled successfully." });
      } catch (error) {
        console.error("Error in canceling application:", error);
        res.status(500).json({ success: false, message: "Failed to cancel the application." });
      }
}
const { default: mongoose } = require('mongoose');
const Project = require('../models/projectSchema');
const Applied=require("../models/appliedSchema");
const User=require("../models/userSchema");
require('dotenv').config();


exports.createProject= async(req,res) => {
    try{
        const {projectName,projectDescription,prerequisites,mode,preferredBranch}=req.body;
        const instructor=req.user.id;
        // console.log(req.user);
        //const instructor=req.user._id;
        if(!projectName || !projectDescription || !prerequisites || !mode || !preferredBranch){
            return res.status(400).json({
                success:false,
                message:"Fill All Details",
            })
        }

        const project=await Project.create({projectName,projectDescription,prerequisites,mode,preferredBranch,instructor});

        return res.status(200).json({
            success:true,
            message:"Project Added SuccessFully",
            project,
        })
    }
    catch(err){
        console.log(err.message);
        return res.status(400).json({
            success:false,
                message:"Error in Adding Project",
                mess:err.message,
        })
    }
}

exports.getAllProjects =async(req,res) => {
    try{
        const allProject=await Project.find({}).populate("instructor").exec();
        return res.status(200).json({
            success:true,
            message:"All Project Sended SuccessFully",
            allProject,
        })
    }
    catch(err){
        return res.status(400).json({
            success:false,
                message:"Error in fetching all Tag",
                mess:err.message
        })
    }
}

exports.updateProject=async(req,res)=>{
    try{
        const {projectName,projectDescription,prerequisites,mode,preferredBranch}=req.body;
        const {projectId}=req.params;
        // console.log(req.user);
        //const instructor=req.user._id;
        if(!projectName || !projectDescription || !prerequisites || !mode || !preferredBranch){
            return res.status(400).json({
                success:false,
                message:"Fill All Details",
            })
        }
        const project=await Project.findByIdAndUpdate(projectId,
                                                        {projectName,
                                                            projectDescription,
                                                            prerequisites,
                                                            mode,
                                                            preferredBranch,
                                                        },{new:true});
        
        return res.status(200).json({
            success:true,
            message:"Project Updated SuccessFully",
            project,
        })
    }
    catch(err){
        console.log(err.message);
        return res.status(400).json({
            success:false,
                message:"Error in Updating Project",
                mess:err.message,
        })
    }
}

exports.deleteProject=async(req,res)=>{
    try{
        const {projectId}=req.params;
        // console.log(req.user);
        //const instructor=req.user._id;

        
        const project=await Project.findByIdAndDelete(projectId);
        
        return res.status(200).json({
            success:true,
            message:"Project deleted SuccessFully",
            
        })
    }
    catch(err){
        console.log(err.message);
        return res.status(400).json({
            success:false,
                message:"Error in deleting Project",
                mess:err.message,
        })
    }
}

exports.getInstructorProjects =async(req,res) => {
    const userID=req.user.id;
    try{
        const Projects=await Project.find({instructor:userID});
        return res.status(200).json({
            success:true,
            message:"All Project Sended SuccessFully",
            Projects,
        })
    }
    catch(err){
        return res.status(400).json({
            success:false,
                message:"Error in fetching all Tag",
                mess:err.message
        })
    }
}

exports.getStudentAppliedProject =async(req,res) => {
    const userId=req.user.id;
    try{
        const AppliedDetails = await Applied.find({ student: userId })
  .populate({
    path: 'project',         // Populate 'project' field in Applied schema
    populate: {
      path: 'instructor',    // Then populate 'instructor' within 'project'
      model: 'User',         // Specify the model for instructor
    }
  })
  .exec();
        console.log("Printing APplied Details",AppliedDetails);
        return res.status(200).json({
            success:true,
            message:"All Project Sended SuccessFully",
            AppliedDetails,
        })
    }
    catch(err){
        return res.status(400).json({
            success:false,
                message:"Error in fetching all Tag",
                mess:err.message
        })
    }
}

exports.deleteAllProjects=async(req,res)=>{
    try{
        const user=await User.updateMany({},{projects:[]});
        const deleteApply=await Applied.deleteMany({});
        const project=await Project.deleteMany({});
        
        
        return res.status(200).json({
            success:true,
            message:"Project deleted SuccessFully",
            
        })
    }
    catch(err){
        console.log(err.message);
        return res.status(400).json({
            success:false,
                message:"Error in deleting Project",
                mess:err.message,
        })
    }
}



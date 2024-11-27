const { default: mongoose } = require('mongoose');
const Project = require('../models/projectSchema');
const Applied=require("../models/appliedSchema");
const User=require("../models/userSchema");
require('dotenv').config();


exports.createProject = async (req, res) => {
  try {
    const { projectName, projectDescription, prerequisites, mode, preferredBranch } = req.body;
    const instructor = req.user.id; // Assuming `req.user` contains the authenticated user's data
    console.log("Instructor ",instructor);
    // Validation
    if (!projectName || !projectDescription || !prerequisites || !mode || !preferredBranch) {
      return res.status(400).json({
        success: false,
        message: "Fill All Details",
      });
    }

    // Create the project
    const project = await Project.create({
      projectName,
      projectDescription,
      prerequisites,
      mode,
      preferredBranch,
      instructor,  // Save instructor's ID as foreign key
    });

    return res.status(200).json({
      success: true,
      message: "Project Added Successfully",
      project,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      success: false,
      message: "Error in Adding Project",
      mess: err.message,
    });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    // Fetch all projects and include the associated instructor (User) details
    console.log("!");
    const allProject = await Project.findAll({
      include: [
        {
          model: User, // Refers to the User model
          as: 'instructorId', // Alias defined in the association
          attributes: ['id', 'firstName', 'lastName'], // Specify attributes to include
        },
      ],
    });
    console.log("Hello=>",allProject[0]);

    console.log("12");

    if (!allProject || allProject.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No Projects Found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'All Projects Fetched Successfully',
      allProject: allProject,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: 'Error in fetching projects',
      mess: err.message,
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { projectName, projectDescription, prerequisites, mode, preferredBranch } = req.body;
    const { projectId } = req.params;
    console.log(projectId);
    // Check if all required fields are provided
    if (!projectName || !projectDescription || !prerequisites || !mode || !preferredBranch) {
      return res.status(400).json({
        success: false,
        message: "Fill All Details",
      });
    }

    // Find and update the project
    const project = await Project.update(
      { 
        projectName, 
        projectDescription, 
        prerequisites, 
        mode, 
        preferredBranch 
      },
      { 
        where: { id: projectId }, // Match the project by ID
        returning: true,         // Ensure we get the updated project in the result
        plain: true,             // Return a simplified object
      }
    );

    if (!project[1]) { // If no rows were updated, project[1] will be null
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project Updated Successfully",
      project: project[1], // Updated project data
    });
  } catch (err) {
    console.error(err.message);
    return res.status(400).json({
      success: false,
      message: "Error in Updating Project",
      error: err.message,
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
      const { projectId } = req.params;

      // Validate projectId
      if (!projectId) {
          return res.status(400).json({
              success: false,
              message: "Project ID is required",
          });
      }

      // Attempt to delete the project
      const deletedCount = await Project.destroy({
          where: { id: projectId }, // Replace `id` with your primary key column if different
      });

      if (deletedCount === 0) {
          return res.status(404).json({
              success: false,
              message: "Project not found",
          });
      }

      return res.status(200).json({
          success: true,
          message: "Project deleted successfully",
      });
  } catch (err) {
      console.error("Error:", err.message);
      return res.status(500).json({
          success: false,
          message: "Error in deleting project",
          error: err.message,
      });
  }
};

exports.getInstructorProjects = async (req, res) => {
  const userId = req.user.id; // Assuming `req.user` contains the authenticated user's info
  try {
      // Fetch projects where instructorId matches the userId
      const Projects = await Project.findAll({
          where: { instructor: userId },
      });
      //console.log(Projects);
      return res.status(200).json({
          success: true,
          message: "All Projects Fetched Successfully",
          Projects, // Include the fetched projects
      });
  } catch (err) {
      console.error(err.message);
      return res.status(500).json({
          success: false,
          message: "Error in Fetching Projects",
          error: err.message,
      });
  }
};

exports.getStudentAppliedProject = async (req, res) => {
  const userId = req.user.id;  // Get the logged-in user's ID
  
  try {
      // Fetch all applications for the student (userId) and include associated project and instructor details
      const appliedDetails = await Applied.findAll({
          where: {
              student: userId  // Filter by the logged-in student's ID
          },
          include: [
              {
                  model: Project,  // Include the Project model
                  as: 'projectId',   // Use the alias defined in the model
                  include: [
                      {
                          model: User,  // Include the instructor from the User model
                          as: 'instructorId',  // Ensure 'instructor' alias is used
                          attributes: ['id', 'firstName', 'lastName', 'email']  // Get necessary instructor fields
                      }
                  ]
              }
          ]
      });

      //console.log("Printing Applied Details", appliedDetails[0]);

      // Return the response with the applied project details
      return res.status(200).json({
          success: true,
          message: "All Projects Fetched Successfully",
          appliedDetails,
      });

  } catch (err) {
      console.error("Error fetching applied projects:", err);
      return res.status(400).json({
          success: false,
          message: "Error in fetching applied projects",
          mess: err.message
      });
  }
};

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

exports.getApplicants = async (req, res) => {
  try {
      const { projectId } = req.params;

      // Validate project ID
      if (!projectId) {
          return res.status(400).json({ error: 'Project ID is required.' });
      }

      // Check if the project exists
      const project = await Project.findByPk(projectId); // Use Sequelize's findByPk to fetch by primary key
      if (!project) {
          return res.status(404).json({ error: 'Project not found.' });
      }

      // Fetch all applicants for the project
      const applicants = await Applied.findAll({
          where: { id:projectId }, // Use the column name for the foreign key
          include: [
              {
                  model: User, // Join the Student table
                  as: 'studentId', // Alias used in your association definition
              },
          ],
      });

      // Check if no applicants are found
      if (applicants.length === 0) {
          return res.status(200).json({ message: 'No applicants found for this project.' });
      }

      // Respond with project and applicants
      res.status(200).json({
          success: true,
          projectName: project.projectName,
          applicants,
      });
  } catch (error) {
      console.error('Error fetching applicants:', error);
      res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

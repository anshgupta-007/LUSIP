const express= require('express');
const User=require("../models/userSchema");
const OTP=require("../models/OTP");
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

exports.applyOnProject = async (req, res) => {
    const { projectId, instructorId } = req.params;
    const userId = req.user.id;
    console.log(userId,projectId,instructorId);
    try {
        // Check if the user has already applied for the project
        const alreadyApplied = await Applied.findOne({
            where: { project:projectId, student: userId, instructor:instructorId }
        });

        if (alreadyApplied) {
            return res.status(200).json({
                success: true,
                message: "You have already applied for this project",
            });
        }

        // Check if the user has reached the limit for applications (assuming limit is 2)
        const totalApplied = await Applied.count({
            where: { student: userId }
        });

        if (totalApplied >= 2) {
            return res.status(200).json({
                success: true,
                message: "You have reached the limit to apply",
            });
        }

        // Fetch user and project details
        const user = await User.findByPk(userId);
        const project = await Project.findByPk(projectId, {
            include: {
                model: User,
                as: 'instructorId', // Assuming 'instructor' is associated with the project
                attributes: ['firstName', 'lastName', 'email']
            }
        });
        console.log("undefined",user);
        if (!user || !project) {
            return res.status(404).json({
                success: false,
                message: "User or Project not found",
            });
        }

        // Prepare names for the email content
        const name = `${user.firstName} ${user.lastName}`;
        const facultyName = `${project.instructorId.firstName} ${project.instructorId.lastName}`;

        // Send email to the user and instructor
        try {
            // Send confirmation email to the user
            await mailSender(
                user.email,
                `Successfully Applied on ${project.projectName}`,
                applyTemplate(project.projectName, name)
            );
            console.log(`Mail sent to ${user.email}`);

            // Send notification email to the instructor
            await mailSender(
                project.instructorId.email,
                `New Student Applied on ${project.projectName} Project`,
                facultyNotificationEmail(facultyName, name, project.projectName)
            );
            console.log(`Mail sent to ${project.instructorId.email}`);

            // Create the application record in the Applied table
            const applyOnProject = await Applied.create({
                project:projectId,
                student: userId,
                status: "Pending",
                instructor:instructorId
            });

            return res.status(200).json({
                success: true,
                message: "Applied successfully",
                applyOnProject
            });
        } catch (emailError) {
            console.error("Error in sending email:", emailError);
            return res.status(402).json({
                success: false,
                message: "Error in sending email",
            });
        }
    } catch (err) {
        console.error("Error in applyOnProject controller:", err.message);
        return res.status(500).json({
            success: false,
            message: "Error in applying for project",
            error: err.message
        });
    }
};

exports.changeStatus = async (req, res) => {
    const { status, applyId, reason } = req.body;
    try {
        // Find the application by applyId
        const oldApply = await Applied.findOne({
            where: { id: applyId },  // Use 'id' as the primary key in Sequelize
        });

        if (!oldApply) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        console.log(oldApply.status);
        
        // If status is already the same, return success
        if (oldApply.status === status) {
            return res.status(200).json({
                success: true,
                message: `Already ${status}`,
            });
        }

        // Update the status and reason in the application
        await Applied.update(
            { status, reason },
            { where: { id: applyId } }
        );

        // Fetch the updated application
        const updatedApply = await Applied.findOne({
            where: { id: applyId },
            include: [
                { model: User, as: 'studentId' },  // Include student (applicant)
                { model: Project, as: 'projectId', include: [{ model: User, as: 'instructorId' }] }  // Include project and instructor
            ]
        });

        // If application not found after update (in case update failed)
        if (!updatedApply) {
            return res.status(404).json({
                success: false,
                message: "Updated application not found",
            });
        }

        // Logging for debugging
        console.log("main", updatedApply);
        
        // Get the student and project details
        const user = updatedApply.studentId;  // student info (Correct alias here)
        const project = updatedApply.projectId;  // project info (Correct alias here)
        
        if (!user || !project || !project.instructorId) {
            return res.status(404).json({
                success: false,
                message: "Missing student or project data"
            });
        }

        const name = `${user.firstName} ${user.lastName}`;
        const facultyName = `${project.instructorId.firstName} ${project.instructorId.lastName}`;

        // Send email based on the new status
        if (status === "Approved") {
            try {
                const response = await mailSender(
                    user.email,
                    `Faculty has approved you on ${project.projectName}`,
                    studentApprovalEmail(name, facultyName, project.projectName)
                );
                console.log(`Faculty has approved you on ${project.projectName}`);
                return res.status(200).json({
                    success: true,
                    message: "Approved Successfully",
                    response,
                });
            } catch (err) {
                console.log("Error in Sending Email");
                return res.status(402).json({
                    success: false,
                    message: "Error in Sending Email",
                });
            }
        } else if (status === "Declined") {
            try {
                const response = await mailSender(
                    user.email,
                    `Faculty has declined you on ${project.projectName}`,
                    studentDeclineEmail(name, facultyName, project.projectName)
                );
                console.log(`Faculty has declined you on ${project.projectName}`);
                return res.status(200).json({
                    success: true,
                    message: "Declined Successfully",
                    response,
                });
            } catch (err) {
                console.log("Error in Sending Email");
                return res.status(402).json({
                    success: false,
                    message: "Error in Sending Email",
                });
            }
        }

    } catch (err) {
        console.log(err.message);
        console.log("Error on Changing Status");
        return res.status(500).json({ success: false, error: err.message });
    }
};



exports.cancelApplicationController = async (req, res) => {
    try {
        const applyId = req.body.applyId;
        const userId = req.user.id;  // Get the logged-in user's ID from the authentication middleware

        console.log(userId, applyId);

        // Check if the application exists and belongs to the logged-in user
        const application = await Applied.findOne({
            where: {
                id: applyId,  // Find by 'id' (primary key in Sequelize)
                student: userId  // Ensure that the logged-in user is the one who applied for the project
            }
        });

        if (!application) {
            console.log("Application not found");
            return res.status(404).json({ success: false, message: "Application not found." });
        }

        // Delete the application
        await application.destroy();  // Use Sequelize's destroy method to delete the record

        res.status(200).json({ success: true, message: "Application cancelled successfully." });
    } catch (error) {
        console.error("Error in canceling application:", error);
        res.status(500).json({ success: false, message: "Failed to cancel the application." });
    }
};
// Import the required modules
const express = require("express");
const router = express.Router();

const {
    createProject,
    getAllProjects,
    updateProject,
    deleteProject,
    getInstructorProjects,
    getStudentAppliedProject,
    deleteAllProjects
} = require('../controllers/Project');

// Importing Middlewares
const { auth, isInstructor, isStudent,isAdmin} = require("../middlewares/auth")

router.post("/createProject",auth,isInstructor,createProject);

router.get("/getallProjects",getAllProjects);

router.post("/updateProject/:projectId",auth,isInstructor,updateProject);

router.post("/deleteProject/:projectId",auth,isInstructor,deleteProject);

router.post("/getInstructorProjects",auth,isInstructor,getInstructorProjects);

router.get("/userSpecificProject",auth, isStudent,getStudentAppliedProject);

router.post("/deleteAllProjects",auth,isAdmin,deleteAllProjects);


module.exports = router;
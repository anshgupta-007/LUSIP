// Import the required modules
const express = require("express");
const router = express.Router();

const { auth, isInstructor, isStudent} = require("../middlewares/auth");
const {applyOnProject,changeStatus}=require('../controllers/applyController');


router.post("/apply/:projectId/:instructorId",auth,isStudent,applyOnProject);

router.post("/changeStatus",auth,isInstructor,changeStatus);

module.exports = router;
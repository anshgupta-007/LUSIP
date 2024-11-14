// Import the required modules
const express = require("express");
const router = express.Router();

const { auth, isInstructor, isStudent} = require("../middlewares/auth");
const {applyOnProject,changeStatus,cancelApplicationController}=require('../controllers/applyController');


router.post("/apply/:projectId/:instructorId",auth,isStudent,applyOnProject);

router.post("/changeStatus",auth,isInstructor,changeStatus);

router.post("/cancelApplication",auth,isStudent,cancelApplicationController);

module.exports = router;
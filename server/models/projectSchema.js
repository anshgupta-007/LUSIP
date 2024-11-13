const mongoose=require('mongoose');

const projectSchema=new mongoose.Schema({
    projectName:{
        type:String,
        required:true,
    },
    projectDescription:{
        type:String,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    prerequisites:{
        type:String,
    },
    mode:{
        type:String,
    },
    preferredBranch:{
        type:String,
    },
    studentsEnrolled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
    ],   
});

module.exports=mongoose.model("Project",projectSchema);
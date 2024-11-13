const mongoose=require('mongoose');
const projectEnrollmentEmail= require('../mail/templates/projectEnrollmentEmail');
const mailSender = require("../utils/mailSender");
const appliedSchema=new mongoose.Schema({
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:["Pending","Approved","Declined"],
        required:true
    },
    reason:{
        type:String,
    },
});

// // Define a function to send emails
// async function sendVerificationEmail(email,courseName, name) {
// 	try {
// 		const mailResponse = await mailSender(
// 			email,
// 			"Course Enrollment Email",
// 			projectEnrollmentEmail(courseName,name)
// 		);
// 		console.log("Email sent successfully: ", mailResponse);
// 	} catch (error) {
// 		console.log("Error occurred while sending email: ", error);
// 		throw error;
// 	}
// }

// // Define a post-save hook to send email after the document has been saved
// appliedSchema.pre("save", async function (next) {
// 	console.log("New document saved to database");

// 	// Only send an email when a new document is created
// 	if (this.isNew) {
// 		await sendVerificationEmail(this.email,this.courseName, this.name);
// 	}
// 	next();
// });

module.exports=mongoose.model("Applied",appliedSchema);
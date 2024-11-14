const User=require("../models/userSchema");
const mailSender=require('../utils/mailSender');
const crypto=require('crypto');
const bcrypt = require('bcrypt');
const {passwordUpdated}=require("../mail/templates/passwordUpdate");
const passwordResetEmail=require("../mail/templates/passwordResetEmail");
//reset passwordtoken
exports.resetPasswordToken = async (req,res) => {
    try{
        const {email}=req.body;
        const  user=await User.findOne({email}); 
        if(!user){
            return res.status(401).json({
                success:false,
                message: "Your Email is not registered with us",
            })
        }
        const token=crypto.randomUUID();

        const updatedDetails=await User.findOneAndUpdate(
            {email:email},
            {
                token:token,
                resetpasswordExpires:Date.now()+5*60*1000,
            },
            {
                new:true,
            }   
        )
        const URL=`http://localhost:3000/update-password/${token}`;
        console.log(URL);
        const userName=user.firstName+" "+user.lastName;
        await mailSender(email,
            "Reset your Password using this link",
            passwordResetEmail(userName,URL)
        )

        return res.json({
            success:true,
            message:"Email Sent SuccessFully, Please Check Email",
            URL, 
            updatedDetails

        })
         
    }
    catch(err){
        return res.status(501).json({
            success:false,
            message:"Sonwthing Went Wrong while generating the Password using Link",
        })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        // Get token and passwords from request body
        const { password, token } = req.body;

        // Find user by token
        const user = await User.findOne({ token: token });
        if (!user) {
            console.log("Invalid Token User Not Found");
            return res.status(201).json({
                success: false,
                message: "Invalid Token",
            });
        }

        // Check if token has expired
        if (user.resetpasswordExpires < Date.now()) {
            console.log("Token expired, Please regenerate your token");
            return res.status(202).json({
                success: false,
                message: "Token expired, Please regenerate your token",
            });
        }

        // Hash the new password
        const saltRounds = 10;
        let hashedPassword;

        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            console.log("Error in hashing the password");
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Error hashing the password",
            });
        }

        // Update user's password in the database
        const newUser = await User.findByIdAndUpdate(
            { _id: user._id },
            { password: hashedPassword },
            { new: true }
        );
        const userName=user.firstName+" "+user.lastName;
        try{
            const response=mailSender(
              user.email,
              `Password Reset Successfully`,
              passwordUpdated(user.email,userName)
            );
        }
        catch(err){
            console.log("Error in Sending Email");
            console.log(err);
            return res.status(402).json({
                success:false,
                message:"Error in Sending Email",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Password Reset Successfully",
        });
    } catch (err) {
        console.log(err);
        return res.status(402).json({
            success: false,
            message: "Something Went Wrong while resetting the password",
        });
    }
};

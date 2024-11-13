const User=require("../models/userSchema");
const mailSender=require('../utils/mailSender');
const crypto=require('crypto');
const bcrypt=require('bcrypt');
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

        await mailSender(email,
            "Password Reset Link",
            `Passoword Reset Link: ${URL}`
        )

        return res.json({
            success:true,
            message:"Email Sent SuccessFully, Please Check Email",
            URL, 
            updatedDetails

        })
         
    }
    catch(err){
        console.log(first);
        return res.status(501).json({
            success:false,
            message:"Sonwthing Went Wrong while generating the Password using Link",
        })
    }
}

exports.resetPassword= async(req,res) => {
    try{
        //get token by URL parameter
        const {password,confirmPassword,token}=req.body;
        if(password!==confirmPassword){
            return res.json({
                success:false,
                message:"Password not matched",
            });
        }
        const user=await User.findOne({token:token});
        if(!user){
            return res.json({
                success:false,
                message:"Invalid Token",
            });
        }
        if(user.resetpasswordExpires <  Date.now()){
            return res.json({
                success:false,
                message:"Token expired, Please regenerate your token",
            });
        }

        let hashedPassword=await bcrypt.hash(password,10);
        const newUser=await User.findByIdAndUpdate(
                                                    {_id: user._id},
                                                    {password:hashedPassword},
                                                    {new:true}
                                                );
                                                
        return res.json({
            success:false,
            message:"Password Reset SuccessFully",
        });

    }
    catch(err){
        return res.json({
            success:false,
            message:"Something Went Wrong while sending reset password email ",
        });
    }
}
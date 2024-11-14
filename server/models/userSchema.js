const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        enum:["Admin","Student","Instructor"],
        required:true,
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile",
    },
    projects:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Project"
        }
    ],
    image:{
        type:String,
        required:true,
    },
    token:{
        type:String,
    },
    resetpasswordExpires:{
        type:Date,
    },
    verifyToken: {
    type: String,
    },
    emailVerified:{
        type:Boolean
    },
    // college:{
    //     type:String,
    //     required:true,
    // },
    // branch:{
    //     type:String,
    //     required:true,
    // },
    // year:{
    //     type:String,
    //     required:true,
    // }
}) 

  userSchema.methods.generateAuthToken = async function () {
    try {
      let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, { expiresIn: '2d' });
      this.tokens = this.tokens.concat({ token: token });
      await this.save();
      return token;
    } catch (error) {
      // console.log(error);
    }
  };
  

module.exports=mongoose.model("User",userSchema);
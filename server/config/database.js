const mongoose=require('mongoose');

require("dotenv").config();

exports.dbConnect= () => {
    mongoose.connect(process.env.DATABASE,{})
        .then(
            console.log("DB Connected SuccesFully")
        )
        .catch((err)=>{
            console.log("Error in Connecting to Database");
            console.log(err.message);
            process.exit(1);
        })    
};

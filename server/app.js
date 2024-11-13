const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors")
const {dbConnect} = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());

app.use(cors({
  credentials: true,
  origin: true}));  
app.set("trust proxy",1); 
app.use(express.json());

dotenv.config({path:"./.env"})

require("./models/userSchema")
require("./models/projectSchema")
require("./models/appliedSchema")

app.use(require("./routes/authRoutes"));
app.use(require("./routes/projectRoutes"));
app.use(require("./routes/applyRoutes"));

dbConnect();

const PORT = process.env.PORT

app.listen(PORT, () => {
   console.log("Server is running on Port",PORT);
});

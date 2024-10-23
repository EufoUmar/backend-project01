import express from "express";
import mongoose from "mongoose";

// const DB_NAME = require("../constants")
import {DB_NAME} from "../constants.js";

const app = express()

const connectDB = async() => {
    try {
       const response = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    
           console.log(`\n mongoDB connected || DB Host ${response.connection.host}`)

//        application listening ------------
       app.listen(process.env.PORT, () => {
         console.log(`Server Started At PORT 8000 ${process.env.PORT}`);
         
       })
    } catch (error) {
        console.log("MongoDB Connection Error", error);
        process.exit(1)
    }
}

export default connectDB
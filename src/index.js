import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./db/index.js";

//simple approch 
// function connectDB() {} 
// connectDB();

//fe
// async function connectDB() 

dotenv.config({
    path: './.env'
});

connectDB();
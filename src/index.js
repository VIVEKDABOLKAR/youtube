import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./db/index.js";
import { app } from "./app.js";

//simple approch 
// function connectDB() {} 
// connectDB();

//fe
// async function connectDB() 

dotenv.config({
    path: './.env'
});

app.on("error", (error) => {
    console.log("Express error: ", error);
});

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server running on port ${process.env.PORT || 8000}`);
    }) 
})
.catch((error) => {
    console.log("Error connecting to DB: ", error);
});
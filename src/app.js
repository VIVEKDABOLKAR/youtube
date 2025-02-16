import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: '32kb'}));
app.use(express.urlencoded({extended: true, limit: '32kb'}));
app.use(cookieParser());

//router import
import userRouter from './routes/user.routes.js';

//roter declaration
 app.use("/api/v1/users",userRouter) //./users: 

export { app }